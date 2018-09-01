'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var body_parser = require("body-parser");

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());
app.use(body_parser.urlencoded({ extended: true }));

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
mongoose.connect(process.env.MONGOLAB_URI);

mongoose.connection.on('connected', function () {
  console.log('FCC Glitch conected to DB');
});

mongoose.connection.on('error', function (err) {
  console.log('Error connecting to DB ', err);
});

var UrlSchema = new mongoose.Schema({
  original_url: { type: String },
  short_url: { type: String },
  created_at: { type: Date }
});

var Url = mongoose.model('Url', UrlSchema);

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});