// script to run every night
const { Op } = require("sequelize");
const MessageModel = require("../models/Message.model");
const ArchivedMessagesModel = require("../models/ArchievedMessages.model");

const archieveOldMessages = async () => {
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  // Find messages older than one day
  const oldMessages = await MessageModel.findAll({
    where: {
      timestamp: {
        [Op.lt]: oneDayAgo,
      },
    },
  });

  await ArchivedMessagesModel.bulkCreate(
    oldMessages.map((message) => message.toJSON())
  );

  await MessageModel.destroy({
    where: {
      timestamp: {
        [Op.lt]: oneDayAgo,
      },
    },
  });
};

module.exports = archieveOldMessages;
