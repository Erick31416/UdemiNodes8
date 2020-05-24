var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var E_preguntaRespuestaSchema = new Schema({
    //Puede tener dificultad? en funcion de la gente que acierta
    //Puede tener puntuacion? en funcion de la gente que cre que este ejercciio tiene un problema o es falso o mejorable.
    enunciado: { type: String, required: [true, 'El enunciado es necesario'] },
    respuestas: [Array],
    //alkaparra, una pregunta puede tener muchas respuestas validas.
    //investigar relaciones nn
    creadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});


module.exports = mongoose.model('E_preguntaRespuesta', E_preguntaRespuestaSchema);