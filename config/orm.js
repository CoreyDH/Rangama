/* Sequelize ORM Will Go Here */

var mysql = require('mysql');
var connection = require('../config/connection.js');


//printQuestionMarks() prevents malicious SQL injection
function printQuestionMarks(num) {
	var arr = [];

	for (var i = 0; i < num; i++) {
		arr.push('?');
	}

	return arr.toString();
}


var orm = {
	all: function (tableInput, cb) {
		var query = 'SELECT * FROM ' ??';';
		connection.query(query, function (err, result) {
			if (err) throw err;
			cb(result);
		});
	},

		// vals is an array of values that we want to insert
	create: function (table, vals, cb) {

		connection.query('INSERT INTO ' + table + ' SET ?', [vals], function (err, result) {
			if (err) throw err;
			cb(result);
		});
	},

		// objColVals would be the columns and values that you want to update
		// an example of objColVals would be {name: panther, sleepy: true}
	update: function (table, updateVals, condition, cb) {
		
		connection.query('UPDATE ' + table + ' SET ? WHERE ?', [updateVals, condition], function (err, result) {
			if (err) throw err;
			cb(result);

;
		});
	},
	delete: function (table, id, cb) {

		connection.query('DELETE FROM '+ table +' WHERE id=?',[id], function (err, result) {
			if (err) throw err;
			cb(result);
		var query = 'DELETE FROM ' + table;
		});
	}
};

module.exports = orm;