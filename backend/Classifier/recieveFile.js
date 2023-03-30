const path = require('path');

exports.recieveFile = async (req, res, next) => {
  const file = req.files.upload;
  const filePath = path.join(__dirname, "uploads", `${file.name}`);

  file.mv(filePath, (err) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send({ message: "File uploaded!" });
  });
};
