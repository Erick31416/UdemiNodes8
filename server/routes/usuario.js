var express = require('express');
var app = express();
const bcrypt = require('bcrypt');
const _ = require("underscore");
const Usuario = require('../models/usuario');

  app.get('/usuario', function (req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({estado : true},'nombre, email,img,role,estado,google')
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios)=>{
      if(err) {
        return res.status(400).json({//400 -> bad request
            ok: false,
            err
        });
      } 
      Usuario.count({estado : true},(err,total)=>{
        res.json({
          ok: true,
          usuarios,
          total
        });
      });
    });
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

    let validdas = ['nombre','email','img','estado','role'];
    let body = _.pick(req.body, validdas);
    //let body = req.body; //[tatuar]


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
  app.put('/borrar/usuario/:id', function (req, res) {

    let identificador = req.params.id; // alkaparra : params no param

      //let body = _.pick(req.body, ['estado']);
      //console.log({body});
      //body.estado = false;
      const body = {estado:false};

      Usuario.findByIdAndUpdate(identificador,body,{new:true},(err,usuarioDb)=>{
        if(err) {
          return res.status(400).json({//400 -> bad request
              ok: false,
              err
          });
        }
        if (!usuarioDb){
          return res.status(400).json({//400 -> bad request
            ok: false,
            err:{
              message: 'usuario no encontrado'
            }
          });
        }
      Usuario.update
      res.json({
        ok: true,
        usuario:usuarioDb
      });
    });
  });
  app.delete('/usuario/:id', function (req, res) {
    let id = req.params.id;
    Usuario.findByIdAndRemove(id,(err,usuaroBorrado)=>{
      if(err) {
        return res.status(400).json({//400 -> bad request
            ok: false,
            err
        });
      }
      if (!usuaroBorrado){
        return res.status(400).json({//400 -> bad request
          ok: false,
          err:{
            message: 'usuario no encontrado'
          }
        });
      }
      res.json({
        ok:true,
        usuario: usuaroBorrado
      });
    });
    
  });
  app.get('/', function (req, res) {
    res.json('Hello World!');
  });

  module.exports = app;