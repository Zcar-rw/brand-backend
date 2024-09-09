import express from 'express';
import multer from 'multer';
import path from 'path';
import { verifyToken } from '../../middlewares';
import asyncHandler from '../../middlewares/asyncHandler';
import FileController from '../../controllers/FileController';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.post(
  '/upload',
  verifyToken,
  upload.single('file'),
  asyncHandler(FileController.uploadFile),
);

export default router;
