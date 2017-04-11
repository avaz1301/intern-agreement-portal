var express     = require('express');
var http        = require('http');
var path        = require('path');
var mime        = require('mime');
var fs          = require('fs');
var aws         = require('aws-sdk');
var formidable  = require('formidable');
var router      = express.Router();
var nodemailer  = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'Mailgun',
  auth: {
    user: process.env.MAILGUN_USERNAME,
    pass: process.env.MAILGUN_PASSWORD
  }
});
const S3_BUCKET   = process.env.S3_BUCKET;
const TARGET_EMAIL = process.env.TARGET_EMAIL;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Intern Agreement Portal',});
});

router.get('/online', function(req,res){
  res.render('agreement');
});

router.get('/download', function(req,res,next){
  var file     = path.join(__dirname,'..','public/images/qc_ILA_agreement.pdf');
  var filename = path.basename(file);
  var mimetype = mime.lookup(file);
  res.setHeader('Content-disposition', 'attachment; filename=' + filename);
  res.setHeader('Content-type', mimetype);
  var filestream = fs.createReadStream(file);
  filestream.pipe(res);
  filestream.on('finish', function() {
      filestream.close();  // close() is async, call cb after close completes.
  });
});

router.get('/sign-s3', function(req, res){
  console.log("IN /SIGN-S3");
  const s3       = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, function(err, data){
    if(err){
      console.log(err, err.stack);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+fileName
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

/**
 * POST /submit-agreement
 */
router.post('/submit-agreement', function(req, res) {
  var mailOptions = {
    from: req.body.name + ' ' + '<'+ req.body.email + '>',
    to: TARGET_EMAIL,
    subject: '✔ Intern Learning Agreement Submission | '+ req.body.name,
    text: 'The purpose of this message is to notify you that '+req.body.name+
          '\nhas succesfully submitted the Intern Learning Agreement Form with the following file name: '+req.body.upload+
          '\nThank You'
  };
  transporter.sendMail(mailOptions, function(err) {
    // req.flash('success', { msg: 'Thank you! Your ILA has been submitted.' });

    res.redirect('/');
  });
});

module.exports = router;
