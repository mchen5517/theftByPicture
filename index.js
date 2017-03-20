'use strict';

var tessel = require('tessel');
var av = require('tessel-av');
var camera = new av.Camera();
var accel = require('accel-mma84').use(tessel.port['B']);
var rfidlib = require('rfid-pn532');

// var os = require('os');
// var http = require('http');
// var port = 8000;

var fs = require('fs');
var path = require('path');

var rfid = rfidlib.use(tessel.port['A']);
rfid.setPollPeriod(1000);

var scanned = false;
var timeout = false;

// const nodemailer = require('nodemailer');

// // create reusable transporter object using the default SMTP transport
// let transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'tesselTeamNine@gmail.com',
//     pass: 'team9rules'
//   }
// });

// setup email data with unicode symbols
let mailOptions = {
    from: '"tesselTeamNine@gmail.com" <tesselTeamNine@gmail.com>', // sender address
    to: 'tesselTeamNine@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ?'
  };


  rfid.on('ready', function(version){
    console.log("Our RFID is running!");
    rfid.on('data', function(card) {
    // console.log('UID:', card.uid.toString('hex'));
    if(card.uid.toString('hex') === "3e223600"){
      // fake processing here 
      // if we were working with credit cards, we can process payment
      scanned = !scanned;
      tessel.led[2].toggle();
    }
  });
  });

  accel.on('ready', function () {
    console.log("Accelerometer is working!");
    // Stream accelerometer data
    accel.on('data', function (xyz) {
      if(!scanned && (Math.abs(xyz[0]) > 1 || Math.abs(xyz[1]) > 1 || Math.abs(xyz[2]) - 1 > .5) && !timeout){
        console.log("picture taken!")
        // camera.capture().pipe(fs.createWriteStream(path.join(__dirname, 'capture.jpg')))
        camera.capture()
        .on('data', function(data){

  //         mailOptions = {
  //   from: '"tesselTeamNine@gmail.com" <tesselTeamNine@gmail.com>', // sender address
  //   to: 'tesselTeamNine@gmail.com', // list of receivers
  //   subject: 'someones jacking your stuff', // Subject line
  //   text: data.toString()
  // };

          // // send mail with defined transport object
          // transporter.sendMail(mailOptions, (error, info) => {
          //   if (error) {
          //     return console.log(error);
          //   }
          //   console.log('Message %s sent: %s', info.messageId, info.response);
          // });


          console.log(data);
          timeout = true;
          setTimeout(function(){timeout = false;}, 3000);
        });
      }
    });
  });

