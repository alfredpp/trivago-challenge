var http = require('http');
var formidable = require('express-formidable');
var express = require('express');
var handlebars = require('express-handlebars');
var csv = require('fast-csv');
var fs = require('fs');
var utf8 = require('utf8');
var EasyXml = require('easyxml');
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
app.use('/static', express.static('public'));
app.use(formidable());

app.get('/', (req, res) => {
  res.render('home');
});

app.post('/upload', (req, res) => {
  var readData = [];
  var data = {};
  console.log(req.files.myFile.path);
  if (req.files.myFile.type === 'text/csv') {
    var stream = fs.createReadStream('./static/uploads/hotels.csv');
    var csvStream = csv
      .parse({
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
        console.log("done");
        res.set('Content-Type', 'text/xml');
        var str = convertToXML(readData);
        res.send(str);
      });
    stream.pipe(csvStream);
  }
  else {
    data.message = 'Invalid File type';
    res.render('home', data);
  }

});

function convertToXML(data) {
  var serializer = new EasyXml({
    singularize: true,
    rootElement: 'data',
    dateFormat: 'ISO',
    manifest: true
  });

  return serializer.render({hotels: data});
}

app.listen(4000, function() {
  console.log('Listening on port %s in %s mode', this.address().port, app.get('env'));
});
