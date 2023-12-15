const requireLogin = require('../middlewares/requireLogin');
const AWS = require('aws-sdk');
const keys = require('../config/keys');
const uuid = require('uuid/v1');

const s3 = new AWS.S3({
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey,
    region: 'us-east-1',
})

module.exports = app => {
  app.get('/api/upload', requireLogin, (req, res) => {

    const key = `${req.user.id}/${uuid()}.jpeg`

    s3.getSignedUrl('putObject', {
      Bucket: 'eot-labs-bucket',
      ContentType: 'image/jpeg',
      Key: key
    }, (err, url) => {
      if(err) return res.send(err);
      res.send({ key, url })
    });
  });
};

