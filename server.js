const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const aplicacion = express();
const servidor = http.createServer(aplicacion);
const io = socketio(servidor);

const puerto = 3000;

aplicacion.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado');

    socket.on('disconnect', () => {
        console.log('Un usuario se ha desconectado');
    });
});

servidor.listen(puerto, () => {
    console.log('Servidor escuchando en localhost: ' + puerto);
});
