const mongoose = require('mongoose');

const esquemaPartida = new mongoose.Schema({
    ganadorLinea: { type: String, default: null },
    ganadorBingo: { type: String, default: null },
    numerosExtraidos: { type: [Number], default: [] },
    fecha: { type: Date, default: Date.now },
    duracionSegundos: { type: Number, default: 0 }
});

module.exports = mongoose.model('Partida', esquemaPartida);
