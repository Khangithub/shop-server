const path = require('path');
const multer = require ('multer');

const storage = multer.diskStorage ({
  destination: function (req, file, cb) {
    cb (null, path.join (__dirname, '../../media/'));
  },
  filename: function (req, file, cb) {
    cb (
      null,
      file.fieldname + '-' + Date.now () + file.originalname.match (/\..*$/)[0]
    );
  },
});

exports.mediaUploader = multer ({
  storage,
  limits: {fileSize: 5 * 1024 * 1024}, // 5MB
  fileFilter: (_, file, cb) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg' ||
      file.mimetype == 'video/mp4' ||
      file.mimetype == 'image/svg+xml'
    ) {
      cb (null, true);
    } else {
      cb (null, false);
      const err = new Error ('Only .png, .jpg and .jpeg format allowed!');
      err.name = 'ExtensionError';
      return cb (err);
    }
  },
});
