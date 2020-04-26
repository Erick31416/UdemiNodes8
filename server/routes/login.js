const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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
        let token = jwt.sign({
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

// Configuraciones de Goolge
/* Original de goolge
async function verify() {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
  }
  verify().catch(console.error);
*/
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    //const userid = payload['sub'];
    return{
        nombre: payload.name,
        email:payload.email,
        img: payload.picture,
        google: true,


    }

  }
  //verify().catch(console.error);

app.post('/google', async (req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify (token)
    .catch(e => {
        //console.log({e});//revisar esto por que peta
        return res.status(403).json({
            ok: false,
            e
        });
    });
    Usuario.findOne ({email: googleUser.email},(err,usuarioDb)=>{
        if(err) {
            return res.status(500).json({//400 -> bad request
                ok: false,
                err
            });
        } 

        if (usuarioDb){
            if (usuarioDb.google == false){

                return res.status(400).json({//400 -> bad request
                    ok: false,
                    err :{
                        message: 'Debe usar su autientificacion normal'
                    }
                });

            } else {
                let token = jwt.sign({
                    usuarioDb
                },process.env.SEMILLA,{expiresIn: process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok: true,
                    usuario : usuarioDb,
                    token,
                });
            }
        } else {
            // sin el usuario no existen en la base de datos
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err,usuarioDb) => {
                if(err) {
                    return res.status(500).json({//400 -> bad request
                        ok: false,
                        err
                    });
                }
                let token = jwt.sign({
                    usuarioDb
                },process.env.SEMILLA,{expiresIn: process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok: true,
                    usuario : usuarioDb,
                    token,
                });

            });

        }


    });

    //res.json({
    //    usuario : googleUser
    //});

});

module.exports = app;