var TelegramBot = require('node-telegram-bot-api');

var token = 'YOUR_TELEGRAM_BOT_TOKEN';

var jsonfile = require('jsonfile')
var file = 'auth.json'
jsonfile.readFile(file, function(err, obj) {
  token = obj.token;
  console.log("Bot Started, get ready for the memes and spam");
  // Setup polling way
  var bot = new TelegramBot(token, {polling: true});

  bot.onText(/\/cmd/, function (msg, match) {
    var fromId = msg.from.id;
    var resp = "/echo : Replies with the same answer\n";
    bot.sendMessage(fromId, resp);
  });

  // Matches /echo [whatever]
  bot.onText(/\/echo (.+)/, function (msg, match) {
    var chatId = msg.chat.id;
    var resp = match[1];
    bot.sendMessage(chatId, resp);
  });

  // Matches /echo [whatever]
  bot.onText(/\/clr (.+)/, function (msg, match) {
    var chatId = msg.chat.id;
    match = parseInt(match);
    var resp = ".";
    for (var i = 0; i < match; i++) {
      resp+="\n"
    }
    resp+="."
    bot.sendMessage(chatId, resp);
  });


})
