const axios = require('axios');
const telegraf = require('telegraf');

const TONGUOLOGY_URL = process.env.TONGUOLOGY_URL;
const MARK_AS_SENT_URL = `${TONGUOLOGY_URL}/mark_as_sent`;
const MESSAGES_URL = `${TONGUOLOGY_URL}/get_new_messages`;

async function getNew() {
  try {
    const response = await axios.get(MESSAGES_URL);

    return response.data.data;
  } catch (e) {
    return [];
  }
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
    let extra = {};

    if (message.buttons && message.buttons.length) {
      extra = telegraf.Extra.markup(m => m.keyboard(message.buttons.map(text => m.button(text))).oneTime());
    } else {
      extra = telegraf.Extra.markup(m => m.removeKeyboard());
    }

    extra.parse_mode = 'Markdown';

    try {
      if (message.text) {
        await bot.telegram.sendMessage(message.chatId, message.text, extra);
      }
      if (message.image) {
        await bot.telegram.sendPhoto(message.chatId, { url: message.image }, extra);
      }
      if (message.audio) {
        await bot.telegram.sendVoice(message.chatId, { url: message.audio }, extra);
      }
    } catch (e) {
      console.log('Telegram sendMessage error: ', e);
    }

    messagesToMark.push({
      id: message._id,
      sentAt: Date.now(),
    });
  }

  await markAsSent(messagesToMark);

  return 'ok';
}

let locked = false;
async function trySend(bot) {
  if (locked) return;

  locked = true;
  try {
    await sendAll(bot);
  } catch (e) {
    console.log('Send error: ', e);
  }
  locked = false;
}

function startObservingMessages(bot) {
  setInterval(() => {
    trySend(bot);
  }, 100);
}

module.exports = {
  startObservingMessages,
};
