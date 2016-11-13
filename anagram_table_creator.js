// ********************************************
// off line tool for generating anagram table
// ********************************************

// Dependencies
// =============================================================

function generateAnagram( callback) {
  var express 	= require('express');
  var bodyParser 	= require('body-parser');
  var anagramica = require('anagramica');  //***//


  var lettersCount = 6;
  var minKeys = 4;
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
  for (i = 0; i<100; i++) {
   vowelCount = Math.floor((Math.random() * 2 ) + 2);
  }

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

  var letters ='';
  for (i=0; i<letterArray.length; i++) {
    letters = letters.concat (letterArray[i]);
  }
  //returnObject.letters = letters;

  anagramica.all(letters, function(error, response) {
   if (error) {
      throw error;
    }

    var length = response.all.length - lettersCount;   // the number of keys in the array is the response length minus 6
    if ( length < minKeys || length > maxKeys) {
     callback(-1);
    }
    else {
     for (i = 0; i< length; i++) {
       keys [ i ] = response.all [ i ];
      }  
     returnObject.keys= keys;
     returnObject.letters = letters;
     callback(0, returnObject);
    }
  }); 
}



//  Begin app

var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'armingutzmer',
	password: 'Wildcats75',
	database: 'rangama_prototype1_db'
});


connection.connect(function (err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		return;
	}
	console.log('DATABASE CONNECTION SUCCESSFULL id ' + connection.threadId);
});



for (i=0; i<20; i++) {
  var x = generateAnagram( function(err, response){

  	if (err == -1)  {
  		console.log ("anagram error.  try again")
  	}
   	else {
      	var recordString = "('" + response.letters + "'";
      	for (j=0; j < 15; j++) {
      		recordString = recordString.concat(",'");
      		recordString = recordString.concat(response.keys[j]);
      		recordString = recordString.concat("'");
      	}

      	recordString = recordString.concat(")");
		var queryString = "INSERT INTO armin3 (item, key1,key2,key3,key4,key5,key6,key7,key8,key9,key10,key11,key12,key13,key14,key15) VALUES ";
		queryString = queryString.concat(recordString);

		console.log ( "\n\n\n\queryString = ", queryString, "\n\n\n" );

		connection.query(queryString, function (err, result) {
			console.log ("insert result = ", err)
		});
	}				
  });
}

console.log ("\n\n\nDONE WITH FOR LOOP")
