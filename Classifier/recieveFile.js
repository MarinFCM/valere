const tf = require("@tensorflow/tfjs");
const tfn = require("@tensorflow/tfjs-node");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const multer = require("multer");

if (!fs.existsSync("./Classifier/uploads")) {
  fs.mkdirSync("./Classifier/uploads");
}

loadModel().then(
  (result) => (model = result),
  (error) => {
    throw error;
  }
);

const checkFileType = function (file, cb) {
  const fileTypes = /jpeg|jpg|png|svg/;

  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("You can only upload images!");
  }
};

const storageEngine = multer.diskStorage({
  destination: "./Classifier/uploads",
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

exports.upload = multer({
  storage: storageEngine,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

exports.recieveFile = async (req, res, next) => {
  const fileName = req.file.filename;
  const filePath = path.join(__dirname, "uploads", `${fileName}`);

  imgBuffer = readImage(filePath);

  sharp(imgBuffer)
    .resize(28, 28)
    .removeAlpha()
    .greyscale()
    .toColourspace("b-w")
    .toBuffer()
    .then((buf) => {
      runClassification(buf).then((pred) => {
        res.status(200).json({ message: `${pred}` });
        fs.unlink(filePath, (err) => {
          if (err) console.log(err);
        });
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

const readImage = (path) => {
  try {
    imageBuffer = fs.readFileSync(path);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log("File not found!");
    } else {
      throw err;
    }
  }
  return imageBuffer;
};

async function runClassification(imageBuffer) {
  const tfimage = tfn.node.decodeImage(imageBuffer);
  const preds = model.predict(tfimage.expandDims(0)).argMax(-1);
  return preds.data();
}

async function loadModel() {
  const handler = tfn.io.fileSystem("./classificationModel/model.json");
  const model = await tf.loadLayersModel(handler);
  return model;
}
