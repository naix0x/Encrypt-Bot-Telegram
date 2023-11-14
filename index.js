const TelegramBot = require('node-telegram-bot-api');
const crypto = require('crypto');

// Ganti dengan token Bot Telegram yang valid
const token = 'YOUR_TOKEN';

// Inisialisasi bot Telegram
const bot = new TelegramBot(token, {polling: true});

// Pesan dan tombol menu
const startMessage = 'Hello! I am a SHA-1, AES-128 & 256, RSA, MD5 Encryption Bot. Select the desired encryption and decryption method:';
const menuOptions = [
  ['MD5', 'SHA1'],
  ['AES-128', 'AES-256'],
  ['RSA'],
];

// Mengirim pesan awal dan menu tombol
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, startMessage, {
    reply_markup: {
      keyboard: menuOptions,
      resize_keyboard: true,
      one_time_keyboard: true
    }
  });
});

// Menangani pemilihan tombol menu
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text;

  if (menuOptions.flat().includes(message)) {
    bot.sendMessage(chatId, 'Masukkan teks yang ingin dienkripsi:', {
      reply_markup: {
        remove_keyboard: true
      }
    });

    bot.once('message', (msg) => {
      const text = msg.text;
      let encryptedText;

      switch (message) {
        case 'MD5':
          encryptedText = crypto.createHash('md5').update(text).digest('hex');
          break;
        case 'SHA1':
          encryptedText = crypto.createHash('sha1').update(text).digest('hex');
          break;
        case 'AES-128':
          encryptedText = encryptWithAES(text, 'aes-128-cbc');
          break;
        case 'AES-256':
          encryptedText = encryptWithAES(text, 'aes-256-cbc');
          break;
        case 'RSA':
          encryptedText = encryptWithRSA(text);
          break;
      }

      bot.sendMessage(chatId, `Teks terenkripsi:\n${encryptedText}`);
    });
  }
});

// Enkripsi teks menggunakan AES
function encryptWithAES(text, algorithm) {
  const key = crypto.randomBytes(algorithm === 'aes-128-cbc' ? 16 : 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return `${algorithm}#${encrypted}${iv.toString('hex')}`;
}

// Enkripsi teks menggunakan RSA
function encryptWithRSA(text) {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });

  const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(text));

  return `${encrypted.toString('base64')}\nPrivate Key:\n${privateKey}`;
}