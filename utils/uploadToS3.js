const S3 = require("./aws-config");
const MessageModel = require("../models/Message.model");

const uploadToS3 = async (params) => {
  return new Promise(function (resolve, reject) {
    S3.upload(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

module.exports = uploadToS3;
