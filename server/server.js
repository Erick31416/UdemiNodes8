require('./config/config.js');
var express = require('express');
var app = express();
//tutoriales programacion ya.com
var session = require('express-session');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//esto es necesario para el app.use express.static --dirname +public. no se por que 
const path = require('path');

app.set('views', path.resolve( __dirname , '../public'));
app.set('view engine', 'twig');

//si veo app use es un midelware
app.use(bodyParser.urlencoded({ extended: false }))

//tutoriales programacion ya.com
app.use(session({secret: '123456', resave: true, saveUninitialized: true}));

//habilitar el public
//console.log(path.resolve( __dirname + '../public'));
app.use(express.static(path.resolve( __dirname , '../public')));

//configuracion global de rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URL_DB,
  { 
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true  
  },
  (err,res)=> {
    if (err)throw err; 
    console.log('Base de datos online');
  }
);

app.listen(process.env.PORT, function () {
  console.log('proces .env . port es :',process.env.PORT);
});
