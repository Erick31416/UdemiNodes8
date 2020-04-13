const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario');
const app = express();


app.post('/login', function (req, res) {
    let body = req.body;
    Usuario.findOne({email: body.email},(err,usuarioDb)=>{
        if(err) {
            return res.status(400).json({//400 -> bad request
                ok: false,
                err
            });
        } 
        if(!usuarioDb){
            return res.status(400).json({//400 -> bad request
                ok: false,
                err:{
                    message: 'alkaparra-> Usuario o contraseña incorrecta'
                }
            });
        }
        if (!bcrypt.compareSync(body.password,usuarioDb.password)) {
            return res.status(400).json({//400 -> bad request
                ok: false,
                err:{
                    message: ' Usuario o alkaparra-> contraseña incorrecta'
                }
            });
        }
        token = jwt.sign({
            usuarioDb
        },process.env.SEMILLA,{expiresIn: process.env.CADUCIDAD_TOKEN}

        );
        res.json({
            ok: true,
            usuarioDb,
            token
        });
    })
});

module.exports = app;