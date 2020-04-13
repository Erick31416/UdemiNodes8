require('./config/config.js');
var express = require('express');
var app = express();

const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//si veo app use es un midelware
app.use(bodyParser.urlencoded({ extended: false }))

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
