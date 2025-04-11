const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only jpg ,png and jpeg formats are allowed to upload"),
      false
    );
  }
};

const upload = multer({ storage, fileFilter });
module.exports = upload;
