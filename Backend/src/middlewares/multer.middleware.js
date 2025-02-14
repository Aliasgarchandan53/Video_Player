import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../../public/temp"); //original url given by hitesh sir is "./public/temp"
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
    /*devs use suffixes to handle same filenames but over temp 
    files will be on server for a short duration hence can be kept with original name 
    */
  },
});

export const upload = multer({ storage });
