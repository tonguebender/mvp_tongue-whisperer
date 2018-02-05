if (!process.env.TONGUOLOGY_URL) {
  process.env.TONGUOLOGY_URL = 'http://localhost:9091';
}

const botAPI = require('./lib/bot-api');
const messages = require('./lib/messages');

const bot = botAPI.start({ token: process.env.BOT_TOKEN });

messages.start(bot);
