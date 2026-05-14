const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { verificarLinea, verificarBingo } = require('./validacion');
const { generarCarton } = require('./generarCarton');
const ModeloPartida = require('./modeloPartida');
const ModeloUsuario = require('./models/Usuario');
const ModeloGanadorPartida = require('./models/GanadorPartida');

const aplicacion = express();
const servidor = http.createServer(aplicacion);
const io = socketio(servidor, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

const puerto = 3000;
const uriBaseDatos = process.env.MONGODB_URI || 'mongodb://localhost:27017/bingodingo';

mongoose.connect(uriBaseDatos)
    .then(() => console.log('Conectado a la base de datos MongoDB'))
    .catch((error) => console.error('Error al conectar a MongoDB:', error));

// ─── Middleware ───────────────────────────────────────────────────────────────
aplicacion.use(cors());
aplicacion.use(express.json());
aplicacion.use(express.static('public'));

// ─── Endpoints REST de autenticación ─────────────────────────────────────────

aplicacion.post('/api/registro', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ ok: false, mensaje: 'Base de datos no disponible. Asegúrate de que MongoDB está corriendo.' });
        }

        const { nombre, password } = req.body;

        if (!nombre || !password) {
            return res.status(400).json({ ok: false, mensaje: 'Nombre y contraseña requeridos.' });
        }
        if (nombre.trim().length < 3 || nombre.trim().length > 20) {
            return res.status(400).json({ ok: false, mensaje: 'El nombre debe tener entre 3 y 20 caracteres.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ ok: false, mensaje: 'La contraseña debe tener al menos 6 caracteres.' });
        }

        const existe = await ModeloUsuario.findOne({ nombre: nombre.trim() });
        if (existe) {
            return res.status(409).json({ ok: false, mensaje: 'Ese nombre de usuario ya está en uso.' });
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const nuevoUsuario = new ModeloUsuario({ nombre: nombre.trim(), passwordHash });
        await nuevoUsuario.save();

        console.log(`Nuevo usuario registrado: ${nombre.trim()}`);
        res.status(201).json({ ok: true, nombre: nombre.trim(), saldo: nuevoUsuario.saldo });
    } catch (error) {
        console.error('Error en /api/registro:', error.message);
        res.status(500).json({ ok: false, mensaje: `Error: ${error.message}` });
    }
});

aplicacion.post('/api/login', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ ok: false, mensaje: 'Base de datos no disponible. Asegúrate de que MongoDB está corriendo.' });
        }

        const { nombre, password } = req.body;

        if (!nombre || !password) {
            return res.status(400).json({ ok: false, mensaje: 'Nombre y contraseña requeridos.' });
        }

        const usuario = await ModeloUsuario.findOne({ nombre: nombre.trim() });
        if (!usuario) {
            return res.status(401).json({ ok: false, mensaje: 'Usuario o contraseña incorrectos.' });
        }

        const passwordCorrecta = await bcrypt.compare(password, usuario.passwordHash);
        if (!passwordCorrecta) {
            return res.status(401).json({ ok: false, mensaje: 'Usuario o contraseña incorrectos.' });
        }

        console.log(`Login correcto: ${nombre.trim()}`);
        res.json({ ok: true, nombre: nombre.trim(), saldo: usuario.saldo });
    } catch (error) {
        console.error('Error en /api/login:', error.message);
        res.status(500).json({ ok: false, mensaje: `Error: ${error.message}` });
    }
});

// ─── Estado global ────────────────────────────────────────────────────────────

// Sala de espera: Map<socketId, { nombre }>
const salaEspera = new Map();
let cuentaAtrasActiva = false;
let timeoutCuentaAtras = null;

// Partida activa
const partida = {
    jugadores: new Map(),
    numerosExtraidos: [],
    bolsa: [],
    estado: 'esperando', // 'esperando' | 'jugando' | 'pausada' | 'finalizada'
    intervaloId: null,
    lineaCantada: false,
    ganadorLinea: null,
    inicioPartida: null,
};

// ─── Helpers bolsa ────────────────────────────────────────────────────────────

function inicializarBolsa() {
    partida.bolsa = [];
    for (let i = 1; i <= 90; i++) {
        partida.bolsa.push(i);
    }
    for (let i = partida.bolsa.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [partida.bolsa[i], partida.bolsa[j]] = [partida.bolsa[j], partida.bolsa[i]];
    }
}

function sacarBola() {
    if (partida.bolsa.length === 0 || partida.estado === 'finalizada' || partida.estado === 'pausada') {
        return null;
    }
    const numero = partida.bolsa.pop();
    partida.numerosExtraidos.push(numero);
    return numero;
}

function iniciarSorteo() {
    if (partida.intervaloId) {
        clearInterval(partida.intervaloId);
    }

    const primerNumero = sacarBola();
    if (primerNumero !== null) {
        io.emit('numeroExtraido', {
            numero: primerNumero,
            numerosExtraidos: partida.numerosExtraidos,
        });
    }

    partida.intervaloId = setInterval(() => {
        if (partida.estado === 'finalizada') {
            clearInterval(partida.intervaloId);
            partida.intervaloId = null;
            return;
        }
        const numero = sacarBola();
        if (numero !== null) {
            io.emit('numeroExtraido', {
                numero,
                numerosExtraidos: partida.numerosExtraidos,
            });
        } else {
            clearInterval(partida.intervaloId);
            partida.intervaloId = null;
        }
    }, 3000);
}

// ─── Lógica sala de espera ────────────────────────────────────────────────────

function obtenerListaSala() {
    return Array.from(salaEspera.values()).map((j) => j.nombre);
}

function emitirEstadoSala() {
    const jugadores = obtenerListaSala();
    io.emit('actualizarSala', { jugadores });
}

function iniciarPartidaDesdeEspera() {
    cuentaAtrasActiva = false;
    timeoutCuentaAtras = null;

    // Mover jugadores de sala a partida
    inicializarBolsa();
    partida.numerosExtraidos = [];
    partida.lineaCantada = false;
    partida.estado = 'jugando';
    partida.ganadorLinea = null;
    partida.inicioPartida = Date.now();
    partida.jugadores.clear();

    salaEspera.forEach((jugador, socketId) => {
        const carton = generarCarton();
        partida.jugadores.set(socketId, { nombre: jugador.nombre, carton, numerosMarcados: [] });

        io.to(socketId).emit('cartonAsignado', { carton });
        io.to(socketId).emit('estadoActual', {
            numerosExtraidos: [],
            estado: 'jugando',
        });
    });

    salaEspera.clear();

    io.emit('partidaIniciada', {});
    iniciarSorteo();
    console.log('¡Partida iniciada desde la sala de espera!');
}

function comprobarInicioPartida() {
    if (salaEspera.size >= 2 && !cuentaAtrasActiva) {
        cuentaAtrasActiva = true;
        const segundos = 5;
        io.emit('iniciarCuentaAtras', { segundos });
        console.log(`Cuenta atrás de ${segundos} s iniciada (${salaEspera.size} jugadores en espera)`);

        timeoutCuentaAtras = setTimeout(() => {
            iniciarPartidaDesdeEspera();
        }, segundos * 1000);
    }
}

function cancelarCuentaAtras() {
    if (cuentaAtrasActiva && timeoutCuentaAtras) {
        clearTimeout(timeoutCuentaAtras);
        cuentaAtrasActiva = false;
        timeoutCuentaAtras = null;
        io.emit('cancelarCuentaAtras', {});
        console.log('Cuenta atrás cancelada (jugador desconectado)');
    }
}

// ─── Sockets ──────────────────────────────────────────────────────────────────

io.on('connection', (socket) => {
    console.log('Conexión nueva: ' + socket.id);

    // El cliente se une a la sala de espera tras autenticarse
    socket.on('unirseASalaEspera', ({ nombre }) => {
        salaEspera.set(socket.id, { nombre });
        emitirEstadoSala();
        comprobarInicioPartida();
        console.log(`${nombre} se unió a la sala de espera (${salaEspera.size} jugadores)`);

        // Si la partida ya está en curso (reconexión tardía), enviar estado
        if (partida.estado === 'jugando' || partida.estado === 'pausada') {
            socket.emit('mensajeSistema', { texto: 'Hay una partida en curso. Espera a la próxima.' });
        }
    });

    // Chat de la sala de espera
    socket.on('mensajeSala', ({ texto }) => {
        const jugador = salaEspera.get(socket.id);
        if (!jugador || !texto || texto.trim() === '') return;
        const hora = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        io.emit('mensajeSala', {
            nombre: jugador.nombre,
            texto: texto.trim().slice(0, 200),
            hora,
        });
    });

    // ── Eventos de partida (igual que antes) ─────────────────────────────────

    socket.on('registrarJugador', ({ nombre }) => {
        // Compatibilidad: si alguien emite registrarJugador directamente
        // lo tratamos como unirse a sala de espera
        if (!salaEspera.has(socket.id) && !partida.jugadores.has(socket.id)) {
            salaEspera.set(socket.id, { nombre });
            emitirEstadoSala();
            comprobarInicioPartida();
        }
    });

    socket.on('marcarNumero', ({ numero, marcado }) => {
        const jugador = partida.jugadores.get(socket.id);
        if (!jugador) return;
        if (marcado) {
            if (!jugador.numerosMarcados.includes(numero)) {
                jugador.numerosMarcados.push(numero);
            }
        } else {
            jugador.numerosMarcados = jugador.numerosMarcados.filter((n) => n !== numero);
        }
    });

    socket.on('cantarLinea', async () => {
        if (partida.estado === 'finalizada' || partida.lineaCantada) return;
        const jugador = partida.jugadores.get(socket.id);
        if (!jugador) return;

        io.emit('verificandoPremio', { tipo: 'linea', nombreJugador: jugador.nombre });
        const esValido = verificarLinea(jugador.carton, partida.numerosExtraidos, jugador.numerosMarcados);

        if (esValido) {
            partida.lineaCantada = true;
            partida.estado = 'pausada';
            partida.ganadorLinea = jugador.nombre;
            if (partida.intervaloId) {
                clearInterval(partida.intervaloId);
                partida.intervaloId = null;
            }
            io.emit('premioValidado', { valido: true, tipo: 'linea', nombreGanador: jugador.nombre });
            console.log(jugador.nombre + ' ha cantado LINEA correctamente');

            // Premiar con 150
            try {
                const usuarioActualizado = await ModeloUsuario.findOneAndUpdate(
                    { nombre: jugador.nombre },
                    { $inc: { saldo: 150 } },
                    { new: true }
                );
                if (usuarioActualizado) {
                    io.to(socket.id).emit('actualizarSaldo', { saldo: usuarioActualizado.saldo });
                }
            } catch (err) {
                console.error('Error al premiar línea:', err);
            }

            setTimeout(() => {
                if (partida.estado !== 'finalizada') {
                    partida.estado = 'jugando';
                    io.emit('reanudarPartida', {});
                    iniciarSorteo();
                }
            }, 5000);
        } else {
            io.emit('premioValidado', { valido: false, tipo: 'linea', nombreGanador: jugador.nombre });
            console.log(jugador.nombre + ' cantó línea incorrectamente');
        }
    });

    socket.on('cantarBingo', async () => {
        if (partida.estado === 'finalizada') return;
        const jugador = partida.jugadores.get(socket.id);
        if (!jugador) return;

        io.emit('verificandoPremio', { tipo: 'bingo', nombreJugador: jugador.nombre });
        const esValido = verificarBingo(jugador.carton, partida.numerosExtraidos, jugador.numerosMarcados);

        if (esValido) {
            partida.estado = 'finalizada';
            if (partida.intervaloId) {
                clearInterval(partida.intervaloId);
                partida.intervaloId = null;
            }
            io.emit('premioValidado', { valido: true, tipo: 'bingo', nombreGanador: jugador.nombre });
            console.log(jugador.nombre + ' ha cantado BINGO correctamente');

            // Premiar con 300
            try {
                const usuarioActualizado = await ModeloUsuario.findOneAndUpdate(
                    { nombre: jugador.nombre },
                    { $inc: { saldo: 300 } },
                    { new: true }
                );
                if (usuarioActualizado) {
                    io.to(socket.id).emit('actualizarSaldo', { saldo: usuarioActualizado.saldo });
                }
            } catch (err) {
                console.error('Error al premiar bingo:', err);
            }

            const numeroJugadores = partida.jugadores.size;
            const nuevaPartida = new ModeloPartida({
                numeroJugadores: numeroJugadores,
            });
            nuevaPartida.save()
                .then(async (partidaGuardada) => {
                    console.log('Partida guardada en la base de datos');
                    if (partida.ganadorLinea) {
                        await ModeloGanadorPartida.create({
                            partidaId: partidaGuardada._id,
                            tipo: 'linea',
                            nombreJugador: partida.ganadorLinea
                        });
                    }
                    await ModeloGanadorPartida.create({
                        partidaId: partidaGuardada._id,
                        tipo: 'bingo',
                        nombreJugador: jugador.nombre
                    });
                    console.log('Ganadores guardados en la base de datos');
                })
                .catch((err) => console.error('Error al guardar la partida:', err));
        } else {
            io.emit('premioValidado', { valido: false, tipo: 'bingo', nombreGanador: jugador.nombre });
            console.log(jugador.nombre + ' cantó bingo incorrectamente');
        }
    });

    socket.on('reiniciarPartida', () => {
        if (partida.intervaloId) {
            clearInterval(partida.intervaloId);
            partida.intervaloId = null;
        }

        partida.numerosExtraidos = [];
        partida.lineaCantada = false;
        partida.estado = 'esperando';
        partida.ganadorLinea = null;
        partida.inicioPartida = null;

        // Devolver jugadores a sala de espera
        partida.jugadores.forEach((jugador, socketId) => {
            salaEspera.set(socketId, { nombre: jugador.nombre });
        });
        partida.jugadores.clear();

        io.emit('partidaReiniciada', {});
        emitirEstadoSala();
        comprobarInicioPartida();
        console.log('Partida reiniciada — jugadores devueltos a sala de espera');
    });

    socket.on('mensajeChat', ({ texto }) => {
        const jugador = partida.jugadores.get(socket.id);
        if (!jugador || !texto || texto.trim() === '') return;
        const hora = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        io.emit('mensajeChat', {
            nombre: jugador.nombre,
            texto: texto.trim().slice(0, 200),
            hora,
        });
    });

    socket.on('disconnect', () => {
        const enSala = salaEspera.get(socket.id);
        const enPartida = partida.jugadores.get(socket.id);

        if (enSala) {
            salaEspera.delete(socket.id);
            emitirEstadoSala();
            if (salaEspera.size < 2) {
                cancelarCuentaAtras();
            }
            console.log(`${enSala.nombre} abandonó la sala de espera`);
        } else if (enPartida) {
            partida.jugadores.delete(socket.id);
            io.emit('jugadorDesconectado', {
                nombre: enPartida.nombre,
                totalJugadores: partida.jugadores.size,
            });
            console.log(`${enPartida.nombre} se desconectó de la partida`);
        } else {
            console.log('Usuario desconectado: ' + socket.id);
        }
    });
});

// ─── Arranque ─────────────────────────────────────────────────────────────────

servidor.listen(puerto, () => {
    console.log('Servidor escuchando en localhost:' + puerto);
});
