// ********************************************
// off line tool for generating anagram table
// ********************************************

// Dependencies
// ============================================================

function generateAnagram( callback) {
  var express 	= require('express');
  var bodyParser 	= require('body-parser');
  var anagramica = require('anagramica');  //***//


  var lettersCount = 6;
  var minKeys = 3;
  var maxKeys = 12;
  var consonantCount;
  var vowelCount;
  var randomVowelCount;
  var letterArray = new Array();
  var index, i;
  var keys = [];

  function anagramObject(letters, keys) {
    this.letters = letters;
    this.keys;
  }
  returnObject = new anagramObject;

  var consonants = ['b','c','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','w','x','y','z'];
  var vowels = ['a','e','i','o','u'];


  // set the number of vowels (vowelCount) to 2 or 3, random
  //for (i = 0; i<100; i++) {
   vowelCount = Math.floor((Math.random() * 2 ) + 2);
 // }

  // set the consonantCount based on the vowelCount
  consonantCount = lettersCount - vowelCount;


  // select consonants
  index = 0;

  for (i=0; i<consonantCount; i++) {
    x = Math.floor((Math.random() * 21 ));
    letterArray [index] = consonants [x];
    index++;
  }

  // select vowels
  for (i=0; i<vowelCount; i++) {
     x = Math.floor((Math.random() * 5 ));
      letterArray [index] = vowels [x];
      index++;
  }

  // create a string of the consonants and vowels
  var letters ='';
  for (i=0; i<letterArray.length; i++) {
    letters = letters.concat (letterArray[i]);
  }

  // call anagramica npm to get anagram keys
  anagramica.all(letters, function(error, response) {
    if (error) {
      callback (-1);
      }
    
      if (response.all.length - 6 < minKeys) {    // if not enough keys to begin with, return -1
        callback (-1);
      }

      k = 0;
      for (i = 0; i < response.all.length; i++) {
        if (response.all [ i ].length > 2) {       // do not pickup answers that are less than 2 characters
         keys [ k ] = response.all [ i ];
         k++;
        }       
      }

      if ( !keys[minKeys-1] || keys[maxKeys] ) {    // if there are not 3 keys or more than 12 keys, return -1
       //  callback(-1);
       }
          
     returnObject.keys= keys;
     returnObject.letters = letters;
     callback(0, returnObject);
    
  }); 
}


//
//  Begin app

var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
	user: 'armingutzmer',
	password: 'Wildcats75',
	database: 'rangama_prototype1_db'
});

var tableMaxRows = 25;
var i;

connection.connect(function (err) {
	if (err) {
		console.error('error connecting to database: ' + err.stack);
		return;
	}
	console.log('DATABASE CONNECTION SUCCESSFULL id ' + connection.threadId);
});

  for (i=0; i<120; i++) {
  var x = generateAnagram( function(err, response){

  	if (err == -1)  {
  	}
   	else {
      	var recordString = "('" + response.letters + "'";
      	for (j=0; j < 15; j++) {
      		recordString = recordString.concat(",'");
      		recordString = recordString.concat(response.keys[j]);
      		recordString = recordString.concat("'");
      	}

      	recordString = recordString.concat(")");
		    var queryString = "INSERT INTO armin212 (item, key1,key2,key3,key4,key5,key6,key7,key8,key9,key10,key11,key12,key13,key14,key15) VALUES ";
		    queryString = queryString.concat(recordString);
		    connection.query(queryString, function (err, result) {
       console.log ("\n\n\nqueryString = ", queryString, "\n\ninsert result = ", err)
		});
	}				
  });
}

console.log ("\n\n\nDONE WITH FOR LOOP")
