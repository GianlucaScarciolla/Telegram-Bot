var TelegramBot = require('node-telegram-bot-api');
var mysql = require('mysql2');
var jsonfile = require('jsonfile');

jsonfile.readFile('auth.json', function(err, obj) {
	var token = obj.token;
	var connection = mysql.createPool({
    connectionLimit : 25,
		host: obj.db_host,
		user: obj.db_user,
		password: obj.db_pass,
		database: obj.db_name});

	// Announce message
	console.log("Bot Started, get ready for the memes and spam");

	// Setup polling way
	var bot = new TelegramBot(token, {polling: true});

	bot.onText(/\/cmd/, function (msg, match) {
		var fromId = msg.from.id;
		var resp = "/echo [msg] : Replies with the same answer\n/clr [int] : Clears chat by X amount\n";
		bot.sendMessage(fromId, resp);
	});

	/**
	 * Outputs whatever text is passed to it
	 */
	bot.onText(/\/echo (.+)/, function (msg, match) {
		var chatId = msg.chat.id;
		var resp = match[1];
		bot.sendMessage(chatId, resp);
	});

	/**
	 * `clears` screen with N * newlines
	 */
	bot.onText(/\/clr (.+)/, function (msg, match) {
		var chatId = msg.chat.id;
		var resp = "";
		if (match[1] <= 1000 && match[1] > 0) {
			resp = ".";
			for (var i = 0; i < match[1]; i++) {
				resp += "\n";
			}
			resp += ".";
		} else {
			resp = "Enter a number between 1-1000 ye <b>Nignog!</b>";
		}
		bot.sendMessage(chatId, resp, {"parse_mode":"HTML"});
	});

	/**
	 * Add to the Todolist of the current chat
	 */
	bot.onText(/\/todoadd (.+)/, function (msg, match) {
		var tg_id = msg.chat.id;
		var chat_id = 0;

		// Save chat ID if it doesn't already exist
		var sql = "INSERT IGNORE INTO chat (tg_id) VALUES (?)";
		connection.execute(sql, [tg_id], function (err, results, fields) {
			// Added new chat
		});

		// Insert todo message
		sql =
		"INSERT INTO todo (chat_id, value) VALUES ((SELECT id FROM chat WHERE tg_id='"+tg_id+"'),?)";
		connection.execute(sql, [match[1]], function (err, results, fields) {
			bot.sendMessage(tg_id, "Added `" + match[1] + "` to the todolist!");
		});
	});

	/**
	 * View todolist
	 */
	bot.onText(/\/todolist/, function (msg, match) {
		var tg_id = msg.chat.id;

		var sql = "SELECT value FROM todo INNER JOIN chat ON todo.chat_id=chat.id WHERE chat.tg_id=?";
		connection.execute(sql, [tg_id], function (err, results, fields) {
			resp = "Your todolist entries:\n\n";
			for(var i = 0; i < results.length; i++) {
				resp += i + ": " + results[i].value + "\n";
			}
			bot.sendMessage(tg_id, resp);
		});
	});

  /**
	 * k
	 */
  bot.onText(/\/k/, function (msg, match) {
		var chatId = msg.chat.id;
    console.log(match.input);
    switch (match.input) {
      case "/k":
        bot.sendVoice(chatId, "audio-files/k-default.ogg");
        break;
      case "/k rip":
        bot.sendVoice(chatId, "audio-files/k-rip.ogg");
        break;
      case "/k deep":
        bot.sendVoice(chatId, "audio-files/k-deep.ogg");
        break;
      case "/k echo":
        bot.sendVoice(chatId, "audio-files/k-echo.ogg");
        break;
      case "/k wtf":
        bot.sendVoice(chatId, "audio-files/wtf-m8.ogg");
        break;
      case "/k jewtut":
        bot.sendVoice(chatId, "audio-files/jewtorial.ogg");
        break;
      case "/k mc":
        bot.sendVoice(chatId, "audio-files/daniel-mc-default.ogg");
        break;
      case "/k mcrip":
        bot.sendVoice(chatId, "audio-files/daniel-mc-rip.ogg");
        break;
      case "/k ?":
      case "/k help":
        bot.sendMessage(chatId, "Valid Params: <i>?, help, rip, deep, echo, wtf, jewtut, mc, mcrip</i>", {"parse_mode":"HTML"});
        break;
      default:
        bot.sendMessage(chatId, "m8, only send a fuckin param if u kno shit '<i>/k help</i>'", {"parse_mode":"HTML"});
    }

	});
});
