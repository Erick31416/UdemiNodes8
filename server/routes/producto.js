var express = require('express');
var app = express();

//const _ = require("underscore");productos
const Producto = require('../models/productos');
const Catetoria = require('../models/categoria');

const {verificartoken } = require('../midelwares/autentificacion');

app.get('/producto', verificartoken, (req, res) => {
    Producto.find({})
        .sort('producto')
        .populate ('usuario','nombre email')
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({//400 -> bad request
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos,
            });

        });
});

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

app.get('/producto/:id', verificartoken, (req, res) => {

    //let productoId = req.body.productoId;
    //5e9c80e2e7a3b24dcdc60f54
    let productoId = req.params.id; // alkaparra : params no param
    Producto.findById(productoId)
        .exec((err, producto) => {
            if (err) {
                return res.status(400).json({//400 -> bad request
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto
            });
        });
});
app.get('/producto/buscar/:nombre', verificartoken, (req, res) => {

    let nombre = req.params.nombre;
    
    let exp = new RegExp (nombre,'i');// alkaparra investigar mas sobre RegExp

    Producto.find({nombre : exp})
        .exec((err, producto) => {
            if (err) {
                return res.status(400).json({//400 -> bad request
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto
            });
        });
});

app.put('/producto/:id', [verificartoken], (req, res) => {

    let identificador = req.params.id; // alkaparra : params no param
    let body = req.body;
    Producto.findByIdAndUpdate(identificador, body, (err, productoDb) => {
        if (err) {
            return res.status(400).json({//400 -> bad request
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDb
        });
    });
});
app.delete('/producto/:id', [verificartoken], (req, res) => {
    let identificador = req.params.id; // alkaparra : params no param

    Producto.findById(identificador, (err, productoDb) => {
        if (err) {
            return res.status(400).json({//400 -> bad request
                ok: false,
                err
            });
        }

        productoDb.disponible = false;
        productoDb.save((err, productoDb) => {//save palabra reseravada de moongose.
            if (err) {
                return res.status(400).json({//400 -> bad request
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productoDb
            });
        });
    });
});

module.exports = app;