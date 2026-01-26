const express = require('express');
const attachmentController = require('../controllers/attachmentController');
const { authenticate } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.use(authenticate);

router.post('/', upload.single('file'), attachmentController.upload.bind(attachmentController));

module.exports = router;