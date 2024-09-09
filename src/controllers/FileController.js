import 'dotenv/config';
import status from '../config/status';
import path from 'path'

export default class FileController {
  static async uploadFile(req, res) {
    try {
      if (!req.file) {
        return res.status(status.BAD_REQUEST).json({
          status: 'error',
          message: 'No file uploaded.',
        });
      }

      const fileUrl = `${process.env.SERVER_URL}/uploads/${req.file.filename}`;

      res.status(status.OK).json({
        status: 'success',
        message: 'File uploaded successfully',
        data: { url: fileUrl },
      });
    } catch (error) {
      console.error('File upload error:', error);
      res.status(status.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: 'An error occurred while uploading the file.',
      });
    }
  }
}
