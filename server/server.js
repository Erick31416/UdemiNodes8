require('./config/config.js');
var express = require('express');
var app = express();

const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//si veo app use es un midelware
app.use(bodyParser.urlencoded({ extended: false }))

app.use(require('./routes/usuario'));

mongoose.connect('mongodb://localhost:27017/cafe', (err,res)=> {
  if (err)throw err; 
  console.log('Base de datos online');
  
});

app.listen(process.env.PORT, function () {
  console.log('proces .env . port es :',process.env.PORT);
});
