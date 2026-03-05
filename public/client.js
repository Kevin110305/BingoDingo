const socket = io();

const estado = document.querySelector('p');

socket.on('connect', () => {
    console.log('Conectado');
    estado.textContent = 'Conectado al servidor';
});

socket.on('disconnect', () => {
    estado.textContent = 'Desconectado del servidor';
});
