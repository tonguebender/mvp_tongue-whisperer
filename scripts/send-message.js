const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);
const fs = require('fs');


bot.telegram.sendVoice(126498435, {
  url: 'http://skyeng-dictionary-audio.s3.eu-central-1.amazonaws.com/609938310fd3327c11b34d05b772c3fe.mp3'
})
  .then(res => console.log(res), err => console.log(err));
