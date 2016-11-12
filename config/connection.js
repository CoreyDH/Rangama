/* Database Connection */
var mysql = require('mysql');
var secret = require('./secret.js');

var connection = mysql.createConnection(process.env.JAWSDB_URL || secret);

connection.connect(function (err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		return;
	}
	console.log('Connect to MySQL database on thread ' + connection.threadId);
});

module.exports = connection;
