var express = require('express');
var app = express();

//const _ = require("underscore");
const E_preguntaRespuesta = require('../models/e_preguntaRespuesta');

const { isAdmin, verificartoken, verificartoken_web } = require('../midelwares/autentificacion');



app.get('/crearEje',verificartoken_web,  (req, res) => {

    res.render('crearEjercicio1');
    
});

app.post('/postejerccio',verificartoken_web,  (req, res) => {

    let body = req.body;
    var array = body.respuesta;
    //var array = ["2","1"];
    
    let ejercicio = new E_preguntaRespuesta({
        enunciado: body.enunciado,
        respuestas: array,
    });

    ejercicio.save((err, producto) => {//save palabra reseravada de moongose.
        if (err) {
            console.log({err});
            res.render('login');
        }
        res.render('crearEjercicio1');
    });
});

app.get('/listaEje',verificartoken_web,  (req, res) => {

    E_preguntaRespuesta.find({})
    .exec((err, preguntas) => {

        if (err) {
            res.render('login');
        }
        res.render('listar',{
            lista : preguntas
          });

    });
    
});
app.get('/listaEjePostMan',  (req, res) => {

    E_preguntaRespuesta.find({})
    .exec((err, preguntas) => {

        if (err) {
            res.render('login');
        }
        res.preguntas;

    });
    
});
app.get('/examentipozero',verificartoken_web,  (req, res) => {

    E_preguntaRespuesta.find({})
    .exec((err, preguntas) => {

        if (err) {
            res.render('login');
        }

        max = preguntas.length;
        min = 0;
        nEjerccio = Math.floor(Math.random() * (max - min)) + min;

        res.render('hacerUnaPregunta',{
            pregunta : preguntas[nEjerccio]
          });

    });
    
});

app.get('/contestar/enunciadorespuesta/:id',verificartoken_web, (req, res) => {

    let identificador = req.params.id; // alkaparra : param
    E_preguntaRespuesta.findById(identificador,(err,ejercicio)=>{
    

        if (err) {
            res.render('login');
        }
        res.render('contestar_enunciadoRespuesta',{
            ejercicio : ejercicio
          });

    });
    
});


module.exports = app;
/*
app.post('/producto', [verificartoken], (req, res) => {
    let body = req.body;

    Producto.findOne({ producto: body.nombre }, (err, productodb) => {
        if (productodb) {
            return res.status(400).json({//400 -> bad request
                ok: false,
                err: {
                    message: 'ya existe el producto'
                }
            });
        }

        Catetoria.findById(body.catetoriaId,(err,categoriadb)=>{
            if (err) {
                return res.status(400).json({//400 -> bad request
                    ok: false,
                    err
                });
            }
            console.log({categoriadb});
            let producto = new Producto({
                nombre: body.nombre,
                precioUni: body.precioUni,
                descripcion: body.descripcion,
                disponible: true,
                usuario: req.usarioLog._id,
                categoria: categoriadb._id,
            });

            producto.save((err, producto) => {//save palabra reseravada de moongose.
                if (err) {
                    return res.status(400).json({//400 -> bad request
                        ok: false,
                        err
                    });
                }
                res.status(201).json({
                    ok: true,
                    producto
                });
            });
        });
    });
});
*/