var TelegramBot = require('node-telegram-bot-api');
var mysql = require('mysql2');
var jsonfile = require('jsonfile');

var token = 'YOUR_TELEGRAM_BOT_TOKEN';
var file = 'auth.json';

var connection = mysql.createConnection({host:'localhost', user: 'root', password: '', database: 'telegram'});

jsonfile.readFile(file, function(err, obj) {
  token = obj.token;
  console.log("Bot Started, get ready for the memes and spam");
  // Setup polling way
  var bot = new TelegramBot(token, {polling: true});

  bot.onText(/\/cmd/, function (msg, match) {
    var fromId = msg.from.id;
    var resp = "/echo [msg] : Replies with the same answer\n/clr [int] : Clears chat by X amount\n";
    bot.sendMessage(fromId, resp);
  });

  bot.onText(/\/echo (.+)/, function (msg, match) {
    var chatId = msg.chat.id;
    var resp = match[1];
    bot.sendMessage(chatId, resp);
  });

  bot.onText(/\/clr (.+)/, function (msg, match) {
    var chatId = msg.chat.id;
    var resp = "";
    if (match[1]<=1000 && match[1]>0) {
      resp = ".";
      for (var i = 0; i < match[1]; i++) {
        resp+="\n";
      }
      resp+=".";
    } else {
      resp = "Enter a number between 1-1000 ye <b>Nignog!</b>";
    }
    bot.sendMessage(chatId, resp, {"parse_mode":"HTML"});
  });

  bot.onText(/\/ripDB/, function (msg, match) {
    var chatId = msg.chat.id;
    var resp = "";

    connection.execute('SELECT * FROM test', function (err, results, fields) {

      for (var i = 0; i < results.length; i++) {
        console.log(results[i].todotxt);
        resp += results[i].todotxt;
      }

      bot.sendMessage(chatId, resp);
    });

  });

  bot.onText(/\/kill/, function (msg, match) {
    //process.exit()
  });

});
