
const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    categoria:{
        type: String,
        required:[true,'La categoria es obligatoria']
    },
    usuario: { 
        type: Schema.Types.ObjectId, 
        ref: 'Usuario' 
    }
});
categoriaSchema.methods.toJSON = function () {// recordar para que era esto.
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

module.exports = mongoose.model('Categoria',categoriaSchema);
