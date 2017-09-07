"use strict";

var http = require('http');
var formidable = require('express-formidable');
var express = require('express');
var handlebars = require('express-handlebars');
var csv = require('fast-csv');
var path = require('path');
var fs = require('fs');
var json2csv = require('json2csv');
var utf8 = require('utf8');
var EasyXml = require('easyxml');
var bodyParser = require('body-parser');
var pnf = require('google-libphonenumber').PhoneNumberFormat;
var phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
var _ = require('lodash');

var app = express();

app.engine('hbs', handlebars({
  layoutsDir: './views/layouts',
  defaultLayout: 'index.hbs',
  extname: 'hbs',
}));

app.set('view engine', 'hbs');
app.set('views', './views');
app.use(express.static('public'));
app.use(formidable({
  multiples: true
}));

app.get('/', (req, res) => {
  res.render('home');
});

app.post('/upload', (req, res) => {
  var readData = [];
  var data = {
    messages: [],
    files: []
  };
  var messages = [];
  var files = [];
  var str = '';
  var uploadLocation = path.join(__dirname, 'public/uploads');
  var fileName = '';
  if (req.files.myFile.type === 'text/csv' && _.isEmpty(req.fields) !== true) {
    var stream = fs.createReadStream(req.files.myFile.path);
    fileName = path.parse(req.files.myFile.name).name;

    var csvStream = csv
      .fromStream(stream, {
        headers: true,
        ignoreEmpty: true
      })
      .transform(function(data){
        // Convert the hotel name to utf-8.
        data.name = utf8.decode(utf8.encode(data.name));
        // Convert the stars value to positive number.
        data.stars = Math.abs(data.stars);
        // Use google-libphonenumber library to validate phone number.
        try {
            var phoneNumber = phoneUtil.parse(data.phone, 'US');
            data.phone = phoneUtil.format(phoneNumber, pnf.INTERNATIONAL);
        } catch (e) {
          console.log(data.phone + ' does not have a valid country code.');
        }
        return data;
      })
      .on("data", function(data){
        readData.push(data);
      })
      .on("end", function(){
        console.log("Parsing done");

        // Generate different file texts according to the user selection
        _.values(req.fields).forEach((field) => {
          switch (field) {
            case 'xml':
              str = convertToXML(readData);
              break;
            case 'json':
              str = JSON.stringify(readData);
              break;
            case 'csv':
              str = convertToCSV(readData);
              break;
          }
          var savedFileName = fileName + Date.now() + '.' + field;
          var destFile = path.format({
            dir: uploadLocation,
            base: savedFileName,
          });
          fs.writeFile(destFile, str, (err) => {
            if (err) {
              throw err;
            }
            else {
              console.log('The file has been saved in /uploads/' + savedFileName);
            }
          });

          messages.push({
            type: 'success',
            message: field + ' file is written in /uploads/' +  savedFileName
          });
          files.push({
            fileType: field,
            path: '/uploads/' + savedFileName,
          });
        });

        data.messages = messages;
        data.files = files;
        return res.render('home', data);
      });
  }
  else if (_.isEmpty(req.fields)) {
    data.messages.push({
      type: 'danger',
      message: 'Please select some output formats'
    });
    return res.render('home', data);
  }
  else {
    data.messages.push({
      type: 'danger',
      message: 'Invalid File type'
    });
    return res.render('home', data);
  }
});

// Function to convert javascript object to XML.
function convertToXML(data) {
  var serializer = new EasyXml({
    singularize: true,
    rootElement: 'data',
    dateFormat: 'ISO',
    manifest: true
  });
  return serializer.render({hotels: data});
}

// Function to convert javascript object to CSV.
function convertToCSV(data) {
  var csvHeaders = _.keys(_.first(data));
  return json2csv({
    data: data,
    fields: csvHeaders
  });
}

app.listen(4000, function() {
  console.log('Listening on port %s in %s mode', this.address().port, app.get('env'));
});
