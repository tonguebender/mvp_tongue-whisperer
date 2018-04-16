const Telegraf = require('telegraf');
const tonguology = require('./tonguology');

function start({ token }) {
  const bot = new Telegraf(token);

  bot.use(async (ctx, next) => {
    console.log('>', `[${ctx.from.id}] ${ctx.updateType} ${ctx.message && ctx.message.text}`);

    await next();
  });

  bot.command('ping', (ctx) => ctx.reply('Pong!'));

  bot.command('start', async (ctx, next) => {
    const from = ctx.from;
    const { id, first_name, last_name, username } = from;

    await tonguology.createUser(`telegram_${id}`, {
      name: first_name || last_name || username,
      chatId: id,
      fullInfo: from,
    });

    ctx._isProcessed = true;

    next();
  });

  bot.command('subscribe', async (ctx, next) => {
    const { id } = ctx.from;

    await tonguology.subscribeUser(`telegram_${id}`, {
      courseId: ctx.message.text.match(/\/.* (.*)/)[1]
    });

    ctx._isProcessed = true;

    next();
  });

  bot.command('unsubscribe', async (ctx, next) => {
    const { id } = ctx.from;

    await tonguology.unsubscribeUser(`telegram_${id}`, {
      courseId: ctx.message.text.match(/\/.* (.*)/)[1]
    });

    ctx._isProcessed = true;

    next();
  });

  bot.command('quizzes', async (ctx, next) => {
    const { id } = ctx.from;

    await tonguology.callAction({
      userId: `telegram_${id}`,
      action: 'quizzes',
    });

    ctx._isProcessed = true;

    next();
  });

  bot.command('quiz', async (ctx, next) => {
    const { id } = ctx.from;
    const match = ctx.message.text.match(/\/[^\s]* (.*)/);

    await tonguology.callAction({
      userId: `telegram_${id}`,
      action: 'quiz',
      text: match && match[1]
    });

    ctx._isProcessed = true;

    next();
  });

  bot.command('stop', async (ctx, next) => {
    const { id } = ctx.from;
    const match = ctx.message.text.match(/\/[^\s]* (.*)/);

    await tonguology.callAction({
      userId: `telegram_${id}`,
      action: 'stop',
      text: match && match[1]
    });

    ctx._isProcessed = true;

    next();
  });

  bot.command('d', async (ctx, next) => {
    const { id } = ctx.from;
    const match = ctx.message.text.match(/\/[^\s]* (.*)/);

    await tonguology.callAction({
      userId: `telegram_${id}`,
      action: 'define',
      text: match && match[1]
    });

    ctx._isProcessed = true;

    next();
  });


  bot.on('text', async (ctx, next) => {
    if (ctx._isProcessed) return next();

    const from = ctx.from;
    const { id, first_name, last_name, username } = from;
    const { text } = ctx.message;

    await tonguology.sendMessage(`telegram_${id}`, {
      name: first_name || last_name || username,
      chatId: id,
      fullInfo: from,
      text,
    });

    next();
  });

  bot.startPolling();

  return bot;
}

module.exports = {
  start
};
