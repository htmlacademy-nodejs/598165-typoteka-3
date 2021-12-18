"use strict";

const multer = require(`multer`);
const path = require(`path`);
const crypto = require(`crypto`);

const {checkFileType} = require(`../../utils`);

const UPLOAD_DIR = `../upload/img`;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = crypto.randomUUID();
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

module.exports.upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024
  },
  fileFilter: (request, file, cb) => {
    cb(null, checkFileType(file));
  }
});
