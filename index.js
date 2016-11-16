var TelegramBot = require('node-telegram-bot-api');
var mysql = require('mysql2');
var jsonfile = require('jsonfile');

var file = 'auth.json';

jsonfile.readFile(file, function(err, obj) {
	var token = obj.token;
	var connection = mysql.createConnection({
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
	 * Outputs `test` table contents.
	 * TODO: remove this
	 */
	bot.onText(/\/ripDB/, function (msg, match) {
		var tg_id = msg.chat.id;
		var resp = "";

		connection.execute('SELECT * FROM todo', function (err, results, fields) {

			for (var i = 0; i < results.length; i++) {
				console.log(results[i].todotxt);
				resp += results[i].todotxt;
			}

			bot.sendMessage(tg_id, resp);
		});

	});

	/**
	 * 
	 */
	bot.onText(/\/todoadd (.+)/, function (msg, match) {
		var tg_id = msg.chat.id;
		var chat_id = 0;

		// Save chat ID if it doesn't already exist
		var sql = "INSERT IGNORE INTO chat (tg_id) VALUES (?)";
		connection.execute(sql, [tg_id], function (err, results, fields) {
			bot.sendMessage(tg_id, "Added new chat " + tg_id + " " + err);
		});

		// Fetch chat.id
		/*
		var sql = "SELECT id FROM chat WHERE tg_id=?";
		connection.execute(sql, [tg_id], function (err, results, fields) {
			chat_id = results[0].id;
			bot.sendMessage(tg_id, "Found chat " + chat_id + " " + err);
		});
		*/
	

		// Insert todo
		var sql = "INSERT INTO todo (chat_id, value) VALUES ((SELECT id FROM chat WHERE tg_id='"+tg_id+"'),?)";
		connection.execute(sql, [match[1]], function (err, results, fields) {

			var output = tg_id + " " + chat_id + " err: " + err;
			bot.sendMessage(tg_id, output);
		});

	});

	/**
	 * TODO: add todolist
	 */

	/**
	 * TODO: remove this
	 */
	bot.onText(/\/kill/, function (msg, match) {
		//process.exit()
	});

});
