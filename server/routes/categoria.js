var express = require('express');
var app = express();

//const _ = require("underscore");
const Categoria = require('../models/categoria');

const { isAdmin, verificartoken } = require('../midelwares/autentificacion');

app.get('/categoria', verificartoken, (req, res) => {
    Categoria.find({})
        .sort('categoria')
        .populate ('usuario','nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({//400 -> bad request
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categorias,
            });

        });
});

app.post('/categoria', [verificartoken], (req, res) => {
    let body = req.body;

    Categoria.findOne({ categoria: body.categoria }, (err, categoriadb) => {
        if (categoriadb) {
            return res.status(400).json({//400 -> bad request
                ok: false,
                err: {
                    message: 'ya existe la categoria'
                }
            });
        }
        let categoria = new Categoria({
            categoria: body.categoria,
            usuario: req.usarioLog._id
        });

        categoria.save((err, categoria) => {//save palabra reseravada de moongose.
            if (err) {
                return res.status(400).json({//400 -> bad request
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categoria
            });
        });
    });
});

app.get('/categoria/:id', verificartoken, (req, res) => {

    //let categoriaId = req.body.categoriaId;
    //5e9c80e2e7a3b24dcdc60f54
    let categoriaId = req.params.id; // alkaparra : params no param
    console.log({categoriaId});
    Categoria.findById(categoriaId)
        .exec((err, categoria) => {
            if (err) {
                return res.status(400).json({//400 -> bad request
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categoria
            });
        });
});

app.put('/categoria/:id', [verificartoken], (req, res) => {

    let identificador = req.params.id; // alkaparra : params no param
    let body = req.body;
    Categoria.findByIdAndUpdate(identificador, body, (err, categoriaDb) => {
        if (err) {
            return res.status(400).json({//400 -> bad request
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDb
        });
    });
});
app.delete('/categoria/:id', [verificartoken, isAdmin], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({//400 -> bad request
                ok: false,
                err
            });
        }
        if (!categoriaBorrada) {
            return res.status(400).json({//400 -> bad request
                ok: false,
                err: {
                    message: 'categoria no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaBorrada
        });
    });

});

module.exports = app;