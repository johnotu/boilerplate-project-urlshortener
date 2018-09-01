'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var shortid = require('shortid');
var body_parser = require('body-parser');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/
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

app.use(cors());
app.use(body_parser.urlencoded({ extended: true }));

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
//console.log('shortid: ', shortid.generate());

app.post('/api/shorturl/new', function (req, res) {
  if (isValid(req.body.url)) {
    Url.findOne({ original_url: req.body.url }, function (err, url) {
      if (!err && url) {
        return res.json({
          original_url: url.original_url,
          short_url: url.short_url
        });
      } else {
        //var short_code = shortid.generate();
        var url = new Url({
          original_url: req.body.url,
          short_url: shortid.generate(), //`https://bald-postbox.glitch.me/api/shorturl/${short_code}`,
          created_at: new Date()
        });
        url.save(function (err, new_url) {
          if (err) return console.error(err);
          return res.json({
            original_url: new_url.original_url,
            short_url: new_url.short_url
          });
        });
      }
    });
  } else {
    return res.json({ error: "invalid URL" });
  }
});

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({ greeting: 'hello API' });
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});

function isValid(url) {
  var cipher = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  return cipher.test(url);
}