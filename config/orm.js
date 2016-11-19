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
    all: function(tableInput, cb) {
        console.log(tableInput);

        connection.query('SELECT * FROM ??', [tableInput], function(err, result) {
            if (err) throw err;
            cb(result);
        });
    },

    // vals is an array of values that we want to insert
    // orm.create('top_score', insertObj, function (data)
    create: function(table, vals, cb) {
        connection.query('INSERT INTO ' + table + ' SET ?', [vals], function(err, result) {
            if (err) throw err;
            cb(result);
        });
    },

    // objColVals would be the columns and values that you want to update
 
    update: function(table, updateVals, condition, cb) {

        connection.query('UPDATE ' + table + ' SET ? WHERE ?', [updateVals, condition], function(err, result) {
            if (err) throw err;
            cb(result);
        });
    },
    delete: function(table, id, cb) {

        connection.query('DELETE FROM ' + table + ' WHERE id=?', [id], function(err, result) {
            if (err) throw err;
            cb(result);
            var query = 'DELETE FROM ' + table;
        });
    },
    retrieveHighScores: function(table,cb) {
        connection.query('SELECT * FROM ' + table + ' ORDER BY topScore DESC LIMIT 50', function(err, result) {
            if (err) throw err;
            cb(result);
        });
    },
    getWords: function(callback) {
            //
        // begin
        //

        var key, keyNumber, keyQuery, keyWord;
        var databaseMax = 180;
        var keysMax = 30;

        // console.log("\n\nGOT TO RANDOM!!!!!!\n\n");

        //**** randomly select an id number
        id = Math.floor((Math.random() * databaseMax) + 1);
        // console.log("db record id = ", id);


        // build a query string
        var queryString = "SELECT * FROM words WHERE id='";
        queryString = queryString.concat(id.toString());
        queryString = queryString.concat("'");

        // get the record and process it
        connection.query(queryString, function (err, result) {
            if(err) throw err;
            callback(result);
        }); 
    }



};

module.exports = orm;
