const TelegramBot = require('node-telegram-bot-api');
const dns = require('dns');

// Ganti dengan token bot Anda
const token = '6142402247:AAEOrxEZGKVvo65yxvQnhiq2IFnuf6HwYzk';

// Inisialisasi bot
const bot = new TelegramBot(token, {polling: true});

// Handler untuk command /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const message = 'Halo, this matic.eu.org! Ketikkan perintah /lookup <host> untuk melakukan lookup DNS.';
  bot.sendMessage(chatId, message);
});

// Handler untuk command /lookup
bot.onText(/\/lookup (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const host = match[1];

  // Melakukan lookup IP4
  dns.resolve4(host, (err, addresses) => {
    if (err) {
      bot.sendMessage(chatId, `Error: ${err.message}`);
      return;
    }

    if (addresses.length === 0) {
      bot.sendMessage(chatId, `Tidak ditemukan hasil untuk host: ${host}`);
      return;
    }

    const ip4Result = addresses.join(', ');
    bot.sendMessage(chatId, `Hasil lookup IP4 untuk host ${host}: ${ip4Result}`);
  });

  // Melakukan lookup IP6
  dns.resolve6(host, (err, addresses) => {
    if (err) {
      bot.sendMessage(chatId, `Error: ${err.message}`);
      return;
    }

    if (addresses.length === 0) {
      bot.sendMessage(chatId, `Tidak ditemukan hasil untuk host: ${host}`);
      return;
    }

    const ip6Result = addresses.join(', ');
    bot.sendMessage(chatId, `Hasil lookup IP6 untuk host ${host}: ${ip6Result}`);
  });

  // Melakukan lookup NS
  dns.resolveNs(host, (err, addresses) => {
    if (err) {
      bot.sendMessage(chatId, `Error: ${err.message}`);
      return;
    }

    if (addresses.length === 0) {
      bot.sendMessage(chatId, `Tidak ditemukan hasil untuk host: ${host}`);
      return;
    }

    const nsResult = addresses.join(', ');
    bot.sendMessage(chatId, `Hasil lookup NS untuk host ${host}: ${nsResult}`);
  });

  // Melakukan lookup MX
  dns.resolveMx(host, (err, addresses) => {
    if (err) {
      bot.sendMessage(chatId, `Error: ${err.message}`);
      return;
    }

    if (addresses.length === 0) {
      bot.sendMessage(chatId, `Tidak ditemukan hasil untuk host: ${host}`);
      return;
    }

    const mxResult = addresses.map((entry) => `${entry.priority} ${entry.exchange}`).join(', ');
    bot.sendMessage(chatId, `Hasil lookup MX untuk host ${host}: ${mxResult}`);
  });

  // Melakukan lookup TXT
  dns.resolveTxt(host, (err, addresses) => {
    if (err) {
      bot.sendMessage(chatId, `Error: ${err.message}`);
      return;
    }

    if (addresses.length === 0) {
      bot.sendMessage(chatId, `Tidak ditemukan hasil untuk host: ${host}`);
      return;
    }

    const txtResult = addresses.join(', ');
    bot.sendMessage(chatId, `Hasil lookup TXT untuk host ${host}: ${txtResult}`);
  });

  // Melakukan lookup SOA
  dns.resolveSoa(host, (err, result) => {
    if (err) {
      bot.sendMessage(chatId, `Error: ${err.message}`);
      return;
    }

    bot.sendMessage(chatId, `Hasil lookup SOA untuk host ${host}: ${JSON.stringify(result)}`);
  });
});
