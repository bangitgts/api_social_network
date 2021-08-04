const multer = require('multer');
let diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        // Định nghĩa nơi file upload sẽ được lưu lại
        callback(null, "uploads/img");
    },
    filename: (req, file, callback) => {
        let math = ["image/png", "image/jpeg"];
        if (math.indexOf(file.mimetype) === -1) {
            let errorMess = "Not Image";
            return callback(errorMess, null);
        }
        let filename = `${Date.now()}-socialnetwork-${file.originalname}`;
        callback(null, filename);
    },
});
let uploadFile = multer({
    storage: diskStorage
}).single("file");
module.exports = uploadFile;