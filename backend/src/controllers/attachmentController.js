const { uploadFileToS3 } = require('../utils/s3Upload');
const pool = require('../config/database');

class AttachmentController {
  async upload(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ status: 'fail', message: 'No file provided' });
      }

      const { taskId } = req.body;
      
      // Upload to S3
      const fileData = await uploadFileToS3(req.file);
      
      // Save to database
      const query = `
        INSERT INTO task_attachments (task_id, file_name, file_url, file_size, mime_type)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      
      const result = await pool.query(query, [
        taskId,
        fileData.fileName,
        fileData.fileUrl,
        fileData.fileSize,
        fileData.mimeType
      ]);

      res.status(201).json({
        status: 'success',
        data: { attachment: result.rows[0] }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AttachmentController();