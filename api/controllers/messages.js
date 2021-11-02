/* eslint-disable prefer-destructuring */
const messageManager = require('../business-logic/messages').default;

const messageController = {
  get: async (req, res) => {
    // returns all messages currently in the system
    try {
      const allMsg = await messageManager.getAllMessages();
      res.send(JSON.stringify(allMsg));
    } catch (error) {
      res.status(500).send(error);
    }
  },
  getMessagesForChannel: async (req, res) => {
    // passed as /api/channels/:channelId/messages
    // eslint-disable-next-line no-warning-comments
    try {
      const channelId = req.params.channelId;
      const channelMsg = await messageManager.getMessagesForChannel(channelId);
      res.status(200).send(JSON.stringify(channelMsg));
    } catch (error) {
      res.status(500).send(error);
    }
  },

  put: async (req, res) => {
    // updates the messages with the specified id
    // passed as /api/messages/:messageId
    try {
      const messageToUpdate = req.params.messageId;
      const newData = req.body;
      if (newData.id !== messageToUpdate) {
        throw error('cannot change channel ID');
      }
      await messageManager.updateMessage(newData);
      res.status(200).send(JSON.stringify(newData));
    } catch (error) {
      res.status(500).send(error);
    }
  },

  post: async (req, res) => {
    // creates a new message based on the passed body
    try {
      const user = req.body.user;
      const text = req.body.text;
      const channelId = req.params.channelId;
      const message = await messageManager.createMessage(user, text, channelId);
      res.status(200).send(JSON.stringify(message));
    } catch (error) {
      res.status(500).send(error);
    }
  },
  delete: async (req, res) => {
    try {
      const messageToDelete = req.params.id;
      await messageManager.removeMessage(messageToDelete);
      res.status(200).send(
        JSON.stringify({
          message: `Message with id ${messageToDelete} was successfully deleted!`,
        }),
      );
    } catch (error) {
      res.status(500).send(error);
    }
  },
};

module.exports = messageController;
