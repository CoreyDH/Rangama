var orm = require('../config/orm.js');

var word = {
	all: function (callback) {
		orm.all('top_score', function (data) {
			callback(data);
		});
	},

	create: function (insertObj, callback) {
		orm.create('top_score', insertObj, function (data) {
			callback(data);
		});
	},
	update: function (updateObj, conditionObj, callback) {
		orm.update('top_score', updateObj, conditionObj, function (data) {
			callback(data);
		});
	},
	delete: function(id, callback) {
		console.log('enter delete');
		orm.delete('top_score', id, function(err, data) {
			callback(data);
		});

	},
	submitScore: function(playerName, score, callback) {
		orm.all('top_score', function(data) {
			for(var i=0; i < data.length; i++) {
				if(score > data[i].score) {
					// enter into database
					
					// if database.length is greater than 50, drop last row from table
					if (database.length > 50) {
						destroy.data[50];
					}
				}
			}
		});

		if(!err)
			return true;
		else 
			return false;
	},
	retrieveHighScores: function(callback) {
		// retrieve high score and return into callback function ordered by descending order.
		orm.retrieveHighScores('top_score', function(data){
			callback(data); 
		});
	},
	storePlayer: function(playerName, score, callback) {
		// add player to database
		orm.update('player', updateObj, conditionObj, function (data) {
			callback(data);
		});
	},
	getWords: function(callback) {
		orm.getWords(callback);
	}
};

module.exports = word;



