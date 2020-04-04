require('./config/config.js');
var express = require('express');
var app = express();
const bodyParser = require('body-parser');
//si veo app use es un midelware
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/usuario', function (req, res) {
  res.json('getUsuario');
});
app.post('/usuario', function (req, res) {
  let body = req.body;
  if (body.nombre === undefined) {
    res.status(400).json({
      ok: false,
      mensaje: 'El nombre es necesario'
    });
  }else{
    res.json({
      body
    });
  }
});
app.put('/usuario/:id', function (req, res) {
  let identificador = req.params.id; // alkaparra : params no param
  res.json({
    identificador
  });
});
app.delete('/usuario', function (req, res) {
  res.json('delete Usuario');
});
app.get('/', function (req, res) {
  res.json('Hello World!');
});

app.listen(process.env.PROT, function () {
  console.log('escuchandoen !',process.env.PROT);
});