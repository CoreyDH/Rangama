var orm = require('../config/orm.js');

var word = {
	all: function (callback) {
		orm.all('words', function (data) {
			callback(data);
		});
	},

	create: function (insertObj, callback) {
		orm.create('words', insertObj, function (data) {
			callback(data);
		});
	},
	update: function (updateObj, conditionObj, callback) {
		orm.update('words', updateObj, conditionObj, function (data) {
			callback(data);
		});
	},
	delete: function(id, callback) {
		console.log('enter delete');
		orm.delete('words', id, function(err, data) {
			callback(data);
		});
	}
};

module.exports = word;
