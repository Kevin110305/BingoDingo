const mongoose = require('mongoose');

const esquemaUsuario = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    saldo: {
        type: Number,
        default: 5000,
    },
    creadoEn: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Usuario', esquemaUsuario);
