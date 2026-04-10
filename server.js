const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const { verificarLinea, verificarBingo } = require('./validacion');
const { generarCarton } = require('./generarCarton');

const aplicacion = express();
const servidor = http.createServer(aplicacion);
const io = socketio(servidor);

const puerto = 3000;

const partida = {
    jugadores: new Map(),
    numerosExtraidos: [],
    bolsa: [],
    estado: 'jugando',
    intervaloId: null,
    lineaCantada: false,
};

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
    }, 7000);
}

inicializarBolsa();

aplicacion.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado');

    socket.on('registrarJugador', ({ nombre }) => {
        const carton = generarCarton();
        partida.jugadores.set(socket.id, { nombre, carton });

        socket.emit('cartonAsignado', { carton });
        socket.emit('estadoActual', {
            numerosExtraidos: partida.numerosExtraidos,
            estado: partida.estado,
        });

        io.emit('jugadorConectado', {
            nombre,
            totalJugadores: partida.jugadores.size,
        });

        console.log('Jugador registrado: ' + nombre);

        if (partida.intervaloId === null && partida.estado !== 'finalizada') {
            iniciarSorteo();
        }
    });

    socket.on('cantarLinea', () => {
        if (partida.estado === 'finalizada' || partida.lineaCantada) {
            return;
        }

        const jugador = partida.jugadores.get(socket.id);
        if (!jugador) {
            return;
        }

        const esValido = verificarLinea(jugador.carton, partida.numerosExtraidos);

        if (esValido) {
            partida.lineaCantada = true;
            partida.estado = 'pausada';
            if (partida.intervaloId) {
                clearInterval(partida.intervaloId);
                partida.intervaloId = null;
            }

            io.emit('premioValidado', {
                valido: true,
                tipo: 'linea',
                nombreGanador: jugador.nombre,
            });

            console.log(jugador.nombre + ' ha cantado LINEA correctamente');

            setTimeout(() => {
                if (partida.estado !== 'finalizada') {
                    partida.estado = 'jugando';
                    io.emit('reanudarPartida', {});
                    iniciarSorteo();
                }
            }, 5000);
        } else {
            socket.emit('premioValidado', {
                valido: false,
                tipo: 'linea',
                nombreGanador: null,
            });

            console.log(jugador.nombre + ' canto linea incorrectamente');
        }
    });

    socket.on('cantarBingo', () => {
        if (partida.estado === 'finalizada') {
            return;
        }

        const jugador = partida.jugadores.get(socket.id);
        if (!jugador) {
            return;
        }

        const esValido = verificarBingo(jugador.carton, partida.numerosExtraidos);

        if (esValido) {
            partida.estado = 'finalizada';
            if (partida.intervaloId) {
                clearInterval(partida.intervaloId);
                partida.intervaloId = null;
            }

            io.emit('premioValidado', {
                valido: true,
                tipo: 'bingo',
                nombreGanador: jugador.nombre,
            });

            console.log(jugador.nombre + ' ha cantado BINGO correctamente');
        } else {
            socket.emit('premioValidado', {
                valido: false,
                tipo: 'bingo',
                nombreGanador: null,
            });

            console.log(jugador.nombre + ' canto bingo incorrectamente');
        }
    });

    socket.on('disconnect', () => {
        const jugador = partida.jugadores.get(socket.id);
        if (jugador) {
            partida.jugadores.delete(socket.id);
            io.emit('jugadorDesconectado', {
                nombre: jugador.nombre,
                totalJugadores: partida.jugadores.size,
            });
            console.log('Jugador desconectado: ' + jugador.nombre);
        } else {
            console.log('Un usuario se ha desconectado');
        }
    });
});

servidor.listen(puerto, () => {
    console.log('Servidor escuchando en localhost: ' + puerto);
});
