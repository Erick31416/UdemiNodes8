const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');
const app = express();

const constOpcionesMenu = require ('../menus/menus');
const { isAdmin, verificartoken, verificartoken_web } = require('../midelwares/autentificacion');


app.post('/login', function (req, res) {
    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioDb) => {
        if (err) {
            return res.status(400).json({//400 -> bad request
                ok: false,
                err
            });
        }
        if (!usuarioDb) {
            return res.status(400).json({//400 -> bad request
                ok: false,
                err: {
                    message: 'alkaparra-> Usuario o contraseña incorrecta'
                }
            });
        }
        if (!bcrypt.compareSync(body.password, usuarioDb.password)) {
            return res.status(400).json({//400 -> bad request
                ok: false,
                err: {
                    message: ' Usuario o alkaparra-> contraseña incorrecta'
                }
            });
        }
        let token = jwt.sign({
            usuarioDb
        }, process.env.SEMILLA, { expiresIn: process.env.CADUCIDAD_TOKEN }

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
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,

    }

}
//verify().catch(console.error);

app.post('/google', async (req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token)
        .catch(e => {
            //console.log({e});//revisar esto por que peta
            return res.status(403).json({
                ok: false,
                e
            });
        });
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDb) => {
        if (err) {
            return res.status(500).json({//400 -> bad request
                ok: false,
                err
            });
        }

        if (usuarioDb) {
            if (usuarioDb.google == false) {

                return res.status(400).json({//400 -> bad request
                    ok: false,
                    err: {
                        message: 'Debe usar su autientificacion normal'
                    }
                });

            } else {
                let token = jwt.sign({
                    usuarioDb
                }, process.env.SEMILLA, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDb,
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

            usuario.save((err, usuarioDb) => {
                if (err) {
                    return res.status(500).json({//400 -> bad request
                        ok: false,
                        err
                    });
                }
                let token = jwt.sign({
                    usuarioDb
                }, process.env.SEMILLA, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDb,
                    token,
                });

            });

        }


    });

    //res.json({
    //    usuario : googleUser
    //});
});


app.get('/web_login', function (req, res, next) {
    res.render('login');
});

app.post('/web_login', function (req, res, next) {

    let body = req.body;
    let error = 0;


    Usuario.findOne({ email: body.mail }, (err, usuarioDb) => {


        var pagina = '';
        if (err) {
            var pagina = '<!doctype html><html><head></head><body>' +
                '<p>un error:</p>' +
                '<a href="/panel">Ingresar</a><br>' +
                '</body></html>';
            res.send(pagina);
            console.log(err);
            error = 1;
            //return res.status(400).json({//400 -> bad request
            //    ok: false,
            //    err
            //});
        }

        if (!usuarioDb) {
            console.log('no hay usuarios');
            var pagina = '<!doctype html><html><head></head><body>' +
                '<p>No usuario:</p>' +
                '<a href="/panel">Ingresar</a><br>' +
                '</body></html>';
            error = 1;

            //return res.status(400).json({//400 -> bad request
            //    ok: false,
            //    err:{
            //        message: 'alkaparra-> Usuario o contraseña incorrecta'
            //    }
            //});
        }

        if (!bcrypt.compareSync(body.password, usuarioDb.password)) {
            console.log('contreaseña ma');
            var pagina = '<!doctype html><html><head></head><body>' +
                '<p>No contraseña:</p>' +
                '<a href="/panel">Ingresar</a><br>' +
                '</body></html>';
            error = 1;
        }


        let token = jwt.sign({
            usuarioDb
        }, process.env.SEMILLA, { expiresIn: process.env.CADUCIDAD_TOKEN }
        );
        req.session.token = token;
        //res.send(pagina); 
        console.log(usuarioDb.role);
        // no podemos hacer una asigancion normal por que eso referenciaria el array y lo modificaria
        let opcionesMenu = constOpcionesMenu.slice();
        if (isAdmin) {
            opcionesMenu.push({
                'ruta': "/addnewUser",
                'slug': "Crear un usuario."
            });
        }
        console.log({constOpcionesMenu});

        res.render('menuPrincipal', {
            opcionesMenu: opcionesMenu,
            error: error
        });

    })


    req.session.mail = req.body.mail;


});
app.get('/panel', function (req, res, next) {
    if (req.session.token) {
        var pagina = '<!doctype html><html><head></head><body>' +
            '<p>Bienvenido</p>' +
            req.session.mail +
            '<br><a href="/logout">Logout</a></body></html>';
        res.send(pagina);
    } else {
        var pagina = '<!doctype html><html><head></head><body>' +
            '<p>No tiene permitido ingresar sin login</p>' +
            '<br><a href="/">Retornar</a></body></html>';
        res.send(pagina);
    }
});


app.get('/logout', function (req, res, next) {
    req.session.destroy();
    var pagina = '<!doctype html><html><head></head><body>' +
        '<br><a href="/">Retornar</a></body></html>';
    res.send(pagina);
});

module.exports = app;