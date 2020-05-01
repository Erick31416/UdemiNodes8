var express = require('express');
var app = express();

//const Producto = require('../models/productos');
//const Catetoria = require('../models/categoria');

const fs = require('fs');
const path = require('path');

const {verificartokenImagen} = require('../midelwares/autentificacion');

app.get('/imagen/:tipo/:imagen',verificartokenImagen, (req, res) => {
    //let token = req.body.idtoken;
    //let token = req.query.token;
    let tipo = req.params.tipo;
    let imagen = req.params.imagen;
    let pathfile = path.resolve(__dirname,`../../upload/${tipo}/${imagen}`);

    if (fs.existsSync(pathfile)) {
        res.sendFile(pathfile);
    } else {
        let pathfile = path.resolve(__dirname,'../assets/imagenNoEncontrada.jpg')
        res.sendFile(pathfile);
    }
});

module.exports = app;