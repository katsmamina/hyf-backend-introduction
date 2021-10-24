const objectId = require('objectid');

const persistentDataAccess = require('../data-access/persistent');

const messageStore = persistentDataAccess('messages');

const messageManager = {
  createMessage: async (user, messageContent, channelId) => {
    const message = {
      id: objectId().toString(),
      username: user,
      content: messageContent,
      channel: channelId,
      date: new Date(),
    };
    await messageStore.create(message);
    return message;
  },
  updateMessage: async (message) => {
    await messageStore.update(message.id, message);
    return message;
  },
  removeMessage: async (messageId) => {
    return await messageStore.remove(messageId);
  },
  getMessage: async (messageId) => {
    const msg = await messageStore.read(messageId);
    return msg;
  },
  getAllMessages: async () => {
    const allmsg = await messageStore.all();
    return allmsg;
  },
  getMessagesForChannel: async (channelId) => {
    const channelMessages = [];
    const allMessages = await messageStore.all();
    for (let i = 0; i < allMessages.length; i++) {
      const theMessage = allMessages[i];
      if (theMessage.channelId === channelId) {
        channelMessages.push(theMessage);
      }
    }
    return channelMessages;
  },
};

module.exports = messageManager;
