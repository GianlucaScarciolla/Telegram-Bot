var TelegramBot = require('node-telegram-bot-api');
var mysql = require('mysql2');
var jsonfile = require('jsonfile');
var dns = require('dns');

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

	bot.onText(/\/chatid/, function (msg, match) {
		var fromId = msg.chat.id;
		var resp = "This is your chat ID: " + fromId;
		bot.sendMessage(fromId, resp);
	});

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
	 * Outputs IP Adress from URL //Luu
	 */
	bot.onText(/\/giveip (.+)/, function (msg, match) {
		var chatId = msg.chat.id;
		var url = match[1];
		dns.resolve4(url, function (err, addresses) {
			bot.sendMessage(chatId, addresses[0]);
		});
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
		//whitelist
		if (tg_id == "-158242806" || tg_id == "173399457" || tg_id == "-1001041246978" || tg_id == "271373170") {
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
		} else {
			bot.sendMessage(tg_id, "Fuck off you are not on the whitelist!");
		}

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
    //console.log(match.input);
		selection = match.input.toLowerCase();
    switch (selection) {
      case "/k":
        bot.sendVoice(chatId, "audio-files/k-default.mp3");
        break;
      case "/k rip":
        bot.sendAudio(chatId, "audio-files/k-rip.mp3");
        break;
      case "/k deep":
        bot.sendAudio(chatId, "audio-files/k-deep.mp3");
        break;
      case "/k echo":
        bot.sendAudio(chatId, "audio-files/k-echo.mp3");
        break;
      case "/k wtf":
        bot.sendAudio(chatId, "audio-files/wtf-m8.mp3");
        break;
      case "/k jewtut":
        bot.sendAudio(chatId, "audio-files/jewtorial.mp3");
        break;
      case "/k mc":
        bot.sendAudio(chatId, "audio-files/daniel-mc-default.mp3");
        break;
      case "/k mcrip":
        bot.sendAudio(chatId, "audio-files/daniel-mc-rip.mp3");
        break;
      case "/k fuckoff":
        bot.sendAudio(chatId, "audio-files/fuckoff.mp3");
        break;
      case "/k fuckoffrip":
        bot.sendAudio(chatId, "audio-files/fuckoff_rip.mp3");
        break;
      case "/k mate":
        bot.sendAudio(chatId, "audio-files/fuckoffmate.mp3");
        break;
      case "/k materip":
        bot.sendAudio(chatId, "audio-files/fuckoffmate_rip.mp3");
        break;
      case "/k lel":
        bot.sendAudio(chatId, "audio-files/lel.mp3");
        break;
      case "/k lelrip":
        bot.sendAudio(chatId, "audio-files/lelrip.mp3");
        break;
      case "/k kek":
        bot.sendAudio(chatId, "audio-files/kek.mp3");
        break;
      case "/k kekrip":
        bot.sendAudio(chatId, "audio-files/kekrip.mp3");
        break;
      case "/k fgt":
        bot.sendAudio(chatId, "audio-files/fgt.mp3");
        break;
      case "/k fgtrip":
        bot.sendAudio(chatId, "audio-files/fgtrip.mp3");
        break;
      case "/k topkek":
        bot.sendAudio(chatId, "audio-files/topkek.mp3");
        break;
      case "/k topkekrip":
        bot.sendAudio(chatId, "audio-files/topkekrip.mp3");
        break;
      case "/k srsly":
        bot.sendAudio(chatId, "audio-files/srsly.mp3");
        break;
      case "/k srslyrip":
        bot.sendAudio(chatId, "audio-files/srslyrip.mp3");
        break;
			case "/k gentoo":
        bot.sendAudio(chatId, "audio-files/gentoo.mp3");
        break;
			case "/k installgentoo":
        bot.sendAudio(chatId, "audio-files/installgentoo.mp3");
        break;
			case "/k nignog":
				bot.sendAudio(chatId, "audio-files/nignog.mp3");
				break;
			case "/k node":
				bot.sendAudio(chatId, "audio-files/nodejs.mp3");
				break;
			case "/k pleb":
				bot.sendAudio(chatId, "audio-files/pleb.mp3");
				break;
			case "/k xd":
				bot.sendAudio(chatId, "audio-files/xd.mp3");
				break;
			case "/k moon":
				bot.sendAudio(chatId, "audio-files/moon.mp3");
				break;
			case "/k noom":
				bot.sendAudio(chatId, "audio-files/noom.mp3");
				break;
			case "/k notracist":
				bot.sendAudio(chatId, "audio-files/notracist.mp3");
				break;
			case "/k notracistrip":
				bot.sendAudio(chatId, "audio-files/notracistrip.mp3");
				break;
			case "/k notracistdeep":
				bot.sendAudio(chatId, "audio-files/notracist-deep.mp3");
				break;
      case "/k ?":
      case "/k help":
        bot.sendMessage(chatId, "Valid Params: <i>?, help, rip, deep, echo, wtf, jewtut, mc, mcrip, fuckoff, fuckoffrip, mate, materip, lel, lelrip, kek, kekrip, fgt, fgtrip, topkek, topkekrip, srsly, srslyrip, gentoo, installgentoo, nignog, node, pleb, xd, moon, noom, notracist, notracistrip, notracistdeep</i>", {"parse_mode":"HTML"});
        break;
      default:
        bot.sendMessage(chatId, "m8, only send a fuckin param if u kno shit '<i>/k help</i>'", {"parse_mode":"HTML"});
    }

	});
});
