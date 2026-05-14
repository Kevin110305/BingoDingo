const mongoose = require('mongoose');

const esquemaGanadorPartida = new mongoose.Schema({
    partidaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Partida',
        required: true
    },
    tipo: {
        type: String,
        enum: ['linea', 'bingo'],
        required: true
    },
    nombreJugador: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('GanadorPartida', esquemaGanadorPartida);
