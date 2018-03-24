 //server.js
'use strict'

var express = require('express');
var cors = require('cors');
var path = require('path');
var bodyParser = require('body-parser');
var db = require('./src/db');
var fs = require('fs');
var os = require('os');
var pdf = require('html-pdf');
var Storage = require('@google-cloud/storage');
var Handlebars = require('handlebars');

var app = express();
var router = express.Router();
var port = process.env.REACT_APP_API_PORT || 3001;
var corsOption = {
  origin: true,
  moethods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  credentials: true,
}

//app.use(express.static(path.join(__dirname, 'build')));
app.use(cors(corsOption));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.get('/', function(req, res) {
  res.json('API initialized.');
});

router.route('/voters')
  .get(function(req, res) {
    var query = db.select().table('voters')
    if (req.query.user_id) {
      // get only the user's own adopted voters
      query.where('adopter_user_id', req.query.user_id)
    }
    else {
      // get a single not-yet-adopted voter
      query.where('adopter_user_id', null).limit(1);
    }
    query.then(function(result) {
      res.json(result)
    })
  })
  .put(function(req, res) {
    // TODO: refactor this to not require the conditional. Just take a voter
    // and update the fields that have changed.
    console.log(req.body.sent);
    if (req.body.adopterUserID) {
      db('voters')
        .where('id', req.body.id)
        .update({
          adopter_user_id: req.body.adopterUserId,
          adoption_timestamp: db.fn.now(),
          updated_at: db.fn.now()
        })
        .then(function(result) {
          res.status(200).json(result)
        });
      }
    else if (req.body.sentOn) {
      console.log(req.body.sentOn);
      db('voters')
        .where('id', req.body.id)
        .update({
          plea_letter_sent_timestamp: db.fn.now(),
          updated_at: db.fn.now()
        })
        .then(function(result) {
          res.status(200).json(result)
        });
      }
    else {
      res.send('No action taken.')
    }
  });

function timeStamp() {
  var newDate = new Date();
  var DateString;
  DateString = newDate.getFullYear()
             + ('0' + (newDate.getMonth()+1)).slice(-2)
             + ('0' + newDate.getDate()).slice(-2);
  return DateString;
}

router.route('/voter/:voter_id/letter')
  .get(function(req, res) {
    var timestamp = timeStamp();
    var voterId = req.params.voter_id;
    var template = fs.readFileSync('./letter.html', 'utf8');
    var uncompiledTemplate = Handlebars.compile(template);
    var context = {voter_id: voterId, timestamp: timestamp};
    var html = uncompiledTemplate(context);
    var options = { format: 'Letter' };
    const tmpdir = os.tmpdir();
    const fileName = timestamp + '-' + voterId + '-letter.pdf'
    const filePath = tmpdir + '/' + fileName;
    const bucketName = 'voteforward';
    const storage = new Storage({
      keyFilename: './googleappcreds.json'
    })
    pdf.create(html).toFile(filePath, function(err, response){
      if(err) {
        console.error('ERROR:', err)
      }
      else {
        storage
          .bucket(bucketName)
          .upload(response.filename)
          .then(() => {
            let pleaLetterUrl = 'http://storage.googleapis.com/' + bucketName + '/' + fileName;
            res.send(pleaLetterUrl);
            db('voters')
              .where('id', voterId)
              .update('plea_letter_url', pleaLetterUrl)
              .catch(err=> {
                console.error('ERROR: ', err);
              });
          })
          .catch(err => {
            console.error('ERROR: ', err);
          });
      }
    });
  });

router.route('/user')
  .post(function(req, res) {
    if (req.body.auth0_id) {
      db('users').where('auth0_id', req.body.auth0_id)
        .then(function(result) {
          if (result.length != 0)
          {
            res.status(200).send('User already exists.');
          }
          else
          {
            db('users').insert({auth0_id: req.body.auth0_id})
              .then(function(result) {
              res.status(201).send(result);
            });
          }
        });
    }
    else {
      res.status(500).send('No auth0_id provided.');
    }
  });

//Use router configuration at /api
app.use('/api', router);

//start server and listen for requests
app.listen(port, function() {
  console.log(`api running on port ${port}`);
});
