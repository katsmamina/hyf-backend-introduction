/* eslint-disable no-return-await */
/* eslint-disable object-shorthand */
const objectId = require('objectid');

const persistentDataAccess = require('../data-access/persistent');

const messageStore = persistentDataAccess('messages');

const messageManager = {
  createMessage: async (user, messageContent, channelId) => {
    const message = {
      text: messageContent,
      id: objectId().toString(),
      user: user,
      channelId: channelId,
      date: new Date(),
    };
    await messageStore.create(message);
    return message;
  },
  updateMessage: async (message) => {
    return await messageStore.update(message.id, message);
  },
  removeMessage: async (messageId) => {
    return await messageStore.remove(messageId);
  },
  getMessage: async (id) => {
    return await messageStore.read(id);
  },
  getAllMessages: async () => {
    return await messageStore.all();
  },
  getMessagesForChannel: async (channelId) => {
    const channelMessages = [];
    const allMessages = await messageStore.all(channelId);
    for (let i = 0; i < allMessages.length; i++) {
      const theMessage = allMessages[i];
      if (theMessage.channel === channelId) {
        channelMessages.push(theMessage);
      }
    }
    return channelMessages;
  },
};

module.exports = messageManager;
