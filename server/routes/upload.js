const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/productos');

const fs = require('fs');
const path = require('path');

//app.use(fileUpload());

app.use( fileUpload({ useTempFiles: true }) );

app.post('/upload', function(req, res) {
    console.log('esta pasando');
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'no hay archivo'
            }
        });
    }
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivoGuardar = req.files.archivo;//creo que es el nombre que le pongo en el body en el postman , por ejemplo,
    let nombreArchivo = archivoGuardar.name.split('.');

    const extensionesPermintidas = ['jpg','png']

    if (  extensionesPermintidas.indexOf(nombreArchivo[nombreArchivo.length -1 ]) < 0 ){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'la extension no es valida'
            }
        });
    }

    archivoGuardar.mv(`upload/${archivoGuardar.name}`, (err) => {
        if (err)
          return res.status(500).json({
              ok:false,
              err
          });
    
        res.json({
            ok:true,
            message:'todo ok'
        });
    });

});

//╔══════════════════════════════════════════════════════╗
//║              upload imangen usuario                  ║
app.post('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'no hay archivo'
            }
        });
    }
    const tiposValidos = ['usuarios','productos']
    if ( tiposValidos.indexOf(tipo) < 0 ) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Tipo no valido'
            }
        });
    }

    let archivoGuardar = req.files.archivo;//creo que es el nombre que le pongo en el body en el postman , por ejemplo,
    let nombreArchivoArrayOri = archivoGuardar.name.split('.');

    const extensionesPermintidas = ['jpg','png']
    let extension = nombreArchivoArrayOri[nombreArchivoArrayOri.length -1 ]
    if (  extensionesPermintidas.indexOf(extension) < 0 ){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'la extension no es valida'
            }
        });
    }
    //nombre archivo
    let randomName = new Date().getMilliseconds();
    let nombreArchivo = `${id}-${randomName}.${extension}`

    archivoGuardar.mv(`upload/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
          return res.status(500).json({
              ok:false,
              err
          });
          //la imagen ya esta cargada
          switch (tipo) {
            case 'usuarios':
                  
                imagenUsuario(id,res,nombreArchivo);
            case 'productos':
            
                imagenproducto(id,res,nombreArchivo);
          }
          

    });

});
function imagenUsuario(id,res,nombreArchivo) {
    Usuario.findById(id,(err,usuarioDb)=>{  
        if (err){
            borrarArchivo(nombreArchivo,'usuarios')
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if (!usuarioDb){
            borrarArchivo(nombreArchivo,'usuarios')
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'Usuario no existe'
                }
            });
        }
        borrarArchivo(usuarioDb.img,'usuarios')
        usuarioDb.img = nombreArchivo;
        usuarioDb.save((err,usuarioGuardado)=>{
            res.json({
                ok:true,
                usuarioGuardado,
                nombreArchivo
            })

        });

    });
    
}
function imagenproducto(id,res,nombreArchivo) {

    Producto.findById(id,(err,productoDb)=>{  
        if (err){
            borrarArchivo(nombreArchivo,'productos')
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if (!productoDb){
            borrarArchivo(nombreArchivo,'productos')
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'Producto no existe'
                }
            });
        }
        borrarArchivo(productoDb.img,'productos')
        productoDb.img = nombreArchivo;
        productoDb.save((err,productoGuardado)=>{
            res.json({
                ok:true,
                productoGuardado,
                nombreArchivo
            })

        });

    });
    
}
function borrarArchivo(nombreArchivo,tipo) {

    let pathImg = path.resolve(__dirname,`../../upload/${tipo}/${nombreArchivo}`);
    console.log({pathImg});
    if (fs.existsSync(pathImg)) { 
        fs.unlinkSync(pathImg);
    }
    
}
module.exports = app;