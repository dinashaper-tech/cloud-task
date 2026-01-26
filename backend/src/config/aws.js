const AWS = require('aws-sdk');
const config = require('./index');

AWS.config.update({
  region: config.aws.region,
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey
});

const s3 = new AWS.S3();
module.exports = { s3 };