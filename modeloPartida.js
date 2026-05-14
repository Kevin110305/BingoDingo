const mongoose = require('mongoose');

const esquemaPartida = new mongoose.Schema({
    fecha: { type: Date, default: Date.now },
    numeroJugadores: { type: Number, required: true }
});

module.exports = mongoose.model('Partida', esquemaPartida);
