const express = require('express');
const { uploadController } = require('../controllers/UploadController');

const uploadRoutes = express.Router();


uploadRoutes.post('/', uploadController.upload)


module.exports = {
    uploadRoutes
}