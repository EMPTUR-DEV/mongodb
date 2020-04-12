const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')


let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'La descripción es necesaria']
    },
    idUsuario: {
        type: String,
        required: [true, 'Es necesario estar logueado']
    }

});

categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });

module.exports = mongoose.model('categoria', categoriaSchema);