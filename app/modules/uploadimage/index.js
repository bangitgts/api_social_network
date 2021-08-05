const multer = require('multer');
let diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "uploads/img");
    },
    filename: (req, file, callback) => {

        let filename;
        let math = ["image/png", "image/jpeg"];
        if (math.indexOf(file.mimetype) === -1) {
            let errorMess = "Not Image";
            return callback(errorMess, null);
        }
        filename = `${Date.now()}-socialnetwork-${file.originalname}`;
        callback(null, filename);
    },
});
let uploadFile = multer({
    storage: diskStorage
}).single("file");

module.exports = uploadFile;