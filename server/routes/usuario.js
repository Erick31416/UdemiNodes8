var express = require('express');
var app = express();
const bcrypt = require('bcrypt');
const _ = require("underscore");
const Usuario = require('../models/usuario');

  app.get('/usuario', function (req, res) {
    res.json('getUsuario');
  });

  app.post('/usuario', function (req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password,10),
        role: body.role
    });

    usuario.save( (err,usuarioDb) => {//save palabra reseravada de moongose.
        if(err) {
            return res.status(400).json({//400 -> bad request
                ok: false,
                err
            });
        } 
        res.json({
            ok: true,
            usuario : usuarioDb
        });
    });
  });

  app.put('/usuario/:id', function (req, res) {

    let identificador = req.params.id; // alkaparra : params no param

    console.log('hoola');
    let validdas = ['nombre','email','img','estado','role'];
    //let body = _.pick(req.body, ['nombre', 'email', 'img', 'estado', 'role']);
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    //let body = req.body; //[tatuar]
    console.log({body});

    Usuario.findByIdAndUpdate(identificador,body,{new:true, runValidators:true},(err,usuarioDb)=>{
      console.log({err});
      if(err) {
        return res.status(400).json({//400 -> bad request
            ok: false,
            err
        });
    }
      res.json({
        ok: true,
        usuario:usuarioDb
      });
    });
  });
  app.delete('/usuario', function (req, res) {
    res.json('delete Usuario');
  });
  app.get('/', function (req, res) {
    res.json('Hello World!');
  });

  module.exports = app;