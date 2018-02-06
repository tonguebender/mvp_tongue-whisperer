const telegramBotAPI = require('./lib/telegram-bot-api');
const messages = require('./lib/messages');

const bot = telegramBotAPI.start({ token: process.env.BOT_TOKEN });

messages.start(bot);
