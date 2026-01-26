const { s3 } = require('../config/aws');
const config = require('../config');

async function uploadFileToS3(file) {
  const fileName = `${Date.now()}-${file.originalname}`;
  
  const params = {
    Bucket: config.aws.s3Bucket,
    Key: `attachments/${fileName}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };

  const result = await s3.upload(params).promise();
  
  return {
    fileName: file.originalname,
    fileUrl: result.Location,
    fileSize: file.size,
    mimeType: file.mimetype
  };
}

async function deleteFileFromS3(fileUrl) {
  const key = fileUrl.split('.com/')[1];
  
  const params = {
    Bucket: config.aws.s3Bucket,
    Key: key
  };

  await s3.deleteObject(params).promise();
}

module.exports = { uploadFileToS3, deleteFileFromS3 };
