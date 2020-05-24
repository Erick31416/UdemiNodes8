var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var usuario_ejercicioSchema = new Schema({
    //ALKAPARRA-> para hacer esta relacion tengo que aprender como hacer para dejar una relacion 'abierta'
    //lo que quiero es decirle que esta relacionado con un sckhematipey object id pero no se que tipo va a ser.
    //No se si sera un ejercicip_matematico un ejerccio_pregunta_respuesta o un ejerccio_relllenar huecos
    //el nombre,descripcion, el enunciado, y todo lo demas va en la entidad ejerccio, esto es una relacion
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' ,},
    tipo: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },//Por ejemplo enunciado-> respuesta
    //id_ejercicio: { type: Schema.Types.ObjectId, ref: '', required: true },
    id_ejercicio: { type: String, required: true },
    urgencia: { type: Number, required: true, default: 0 }
});


module.exports = mongoose.model('Usuario_ejercicio', usuario_ejercicioSchema);