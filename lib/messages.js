const axios = require('axios');

const TONGUOLOGY_URL = process.env.TONGUOLOGY_URL;
const MARK_AS_SENT_URL = `${TONGUOLOGY_URL}/mark_as_sent`;
const MESSAGES_URL = `${TONGUOLOGY_URL}/get_new_messages`;

async function getNew() {
  const response = await axios.get(MESSAGES_URL);

  return response.data.data;
}

async function markAsSent(messages) {
  const response = await axios.post(MARK_AS_SENT_URL, { messages });

  return response.data.data;
}

async function sendAll(bot) {
  const messages = await getNew();

  if (!messages.length) return 'ok';

  const messagesToMark = [];
  for (const message of messages) {
    await bot.telegram.sendMessage(message.chatId, message.text);

    messagesToMark.push({
      id: message._id,
      sentAt: Date.now()
    });
  }

  await markAsSent(messagesToMark);

  return 'ok';
}

function start(bot) {
  setInterval(() => {
    // console.time('tick');
    sendAll(bot)
      .then(res => {
        // console.timeEnd('tick');
      }, err => {
        console.log('err', err);
      });
  }, 1000);
}

module.exports = {
  start
};
