// // Routes Go Here
var express = require('express');
var router = express.Router();
// var rangama = require('../models/model.js');
// var anagramica = require('anagramica');
// var scrabbler = require('scrabbler');
var anagram = require('anagram');
var Helper = require('./helper.js');
var db = require('../models/word.js');

// db.submitScore('John', 3000, function(data) {

// });



router.get('/', function (req, res) {
    res.redirect('/rangama');
});

router.get('/rangama', function (req, res) {
    res.render('index', {});
});

router.get('/rangama/standard', function (req, res) {
    res.render('standard', {});
});

router.get('/rangama/top_scores', function (req, res) {

    db.retrieveHighScores(function(scores) {
        console.log(scores);
        res.render('top_scores', scores);
    });
    
});

router.get('/rangama/anagram/get/:word', function (req, res) {

    // console.log(req.params.word);

    // var json = {};

    // json.word = req.params.word.match(/[A-Z]/gi).join('');

    // anagramica.all(json.word, function(error, response) {

    //     if (error) {
    //         throw error;
    //     }

    //     json.anagrams = helper.getMinWordLength(response.all);

    //     anagramica.best(json.word, function(error, response) {
    //         if (error) {
    //             throw error;
    //         }

    //         console.log(response);

    //         json.best = response.best;

    //         res.json(json);
    //     });

    // });


    var json = {};

    // Ignore special or numerical characters
    var word = req.params.word.match(/[a-z]/gi).join('');

    // If there is still a word afterwards
    if (word) {

        anagram.init('./dict/twl06.js', function (err) {
            if (err) throw err;

            anagram.findAnagrams(word, function (err, anagrams) {
                console.log('`%s`: found %d anagrams', anagrams.input, anagrams.count);

                json.word = anagrams.input;
                json.anagrams = Helper.filterAnagrams(anagrams.items);

                // Get the longest words
                var anagramsKeys = Object.keys(anagrams.items); // Set keys to an array

                // Get the object from the last key in the anagrams.items object
                json.best = anagrams.items[anagramsKeys[anagramsKeys.length - 1]];

                console.log(json);

                // console.log(anagrams);
                res.json(json);
            });
        });

        // scrabbler.get(word, function(error, data) {
        //     if(error) throw error;

        //     console.log(data);
        //     res.json(data);

        // });

    } else {

        // Send blank object
        res.json({});
    }

});

router.get('/rangama/anagram/random', function (req, res) {

    // var anagramica = require('anagramica');
    var mysql = require('mysql');

    // // function that calculates scrable points for answer words
    // function getScrablePoints(word) {
    //     var scrablePoints = [1, 3, 3, 2, 1, 4, 2, 4, 1, 8, 5, 1, 3, 1, 1, 3, 10, 1, 1, 1, 1, 4, 4, 8, 4, 10];
    //     var index;

    //     total = 0;
    //     for (i = 0; i < word.length; i++) {
    //         index = word.charCodeAt(i) - 97
    //         total = total + scrablePoints[index];
    //     }
    //     return (total);
    // }



    // objects for main app
    var wordObject = { word: '', score: 0 };

    var anagramObject = {
        word: '',
        anagrams: {
            3: [],
            4: [],
            5: [],
            6: [],
            7: []
        }
    }

    //
    // begin
    //

    var key, keyNumber, keyQuery, keyWord;
    var databaseMax = 180;
    var keysMax = 30;

    console.log("\n\nGOT TO RANDOM!!!!!!\n\n");

    //**** randomly select an id number
    id = Math.floor((Math.random() * databaseMax) + 1);
    console.log("db record id = ", id);


    // build a query string
    var queryString = "SELECT * FROM words WHERE id='"
    queryString = queryString.concat(id.toString());
    queryString = queryString.concat("'");

    // get the record and process it
    connection.query(queryString, function (err, result) {    //read in the record

        anagramObject.word = result[0].item;  // put the scrambled letters in the json

        for (key = 1; key < keysMax; key++) {   // push the answers and their scores in the json
            keyNumber = key.toString();
            keyQuery = "result[0].key".concat(keyNumber);   // creates a string like "result[0].key3" to reference data
            keyWord = eval(keyQuery);        // turn data into a string called keyWord
            var score = Helper.getScrabblePoints(keyWord);   // calculates a scrabble score for that keyWord

            anagramObject.anagrams[keyWord.length+""].push({
                word: keyWord,
                score: total
            });

            // switch (keyWord.length) {

            //     case 3:
            //         anagramObject.anagrams.3.push({
            //             word: keyWord,
            //             score: total
            //         });
            //         break;

            //     case 4:
            //         anagramObject.anagrams.4.push({
            //             word: keyWord,
            //             score: total
            //         });
            //         break;

            //     case 5:
            //         anagramObject.anagrams.5.push({
            //             word: keyWord,
            //             score: total
            //         });
            //         break;


            //     case 6:
            //         anagramObject.anagrams.6.push({
            //             word: keyWord,
            //             score: total
            //         });
            //         break;

            //     case 7:
            //         anagramObject.anagrams.7.push({
            //             word: keyWord,
            //             score: total
            //         });
            //         break;
            // }
        }

        console.log("stem = ", anagramObject.word);

        console.log("\nthree letter words ---");
        for (i = 0; i < 30; i++) {
            if (!anagramObject.anagrams["3"][i]) {
        break;
    }
    // console.log(anagramObject.anagrams.3[i]);
}

      console.log("\nfour letter words ---");  
for (i = 0; i < 30; i++) {
    if (!anagramObject.anagrams["4"][i]) {
        break;
    }
    // console.log(anagramObject.anagrams.4[i]);
}

console.log("\nfive letter words ---");
for (i = 0; i < 30; i++) {
    if (!anagramObject.anagrams["5"][i]) {
        break;
    }
    // console.log(anagramObject.anagrams.5[i]);
}

console.log("\nsix letter words ---");

for (i = 0; i < 30; i++) {
    if (!anagramObject.anagrams["6"][i]) {
        break;
    }
    // console.log(anagramObject.anagrams["6"][i]);
}

console.log("\nseven letter words ---");
for (i = 0; i < 30; i++) {
    if (!anagramObject.anagrams["7"][i]) {
        break;
    }
    // console.log(anagramObject.anagrams["7"][i]);
}

res.json(anagramObject);
});
});

router.get('/rangama/anagram/best/:word', function (req, res) {

    console.log(req.params.word);

    anagramica.best(req.params.word, function (error, response) {
        if (error) {
            throw error;
        }

        console.log(response);

        res.json(Helper.getMinWordLength(response.best));
    });
});


// router.post('/rangama/create', function (req, res) {

// 	if(req.body.burger_name) {
// 		burger.create({ burger_name: req.body.burger_name, devoured: 0 }, function () {
// 			res.redirect('/burgers');
// 		});
// 	} else {
// 		res.redirect('/burgers');
// 	}

// });

// router.put('/rangama/update/:id', function (req, res) {

// 	if(req.params.id) {
// 		burger.update({ devoured: req.body.devoured }, { id: req.params.id }, function () {
// 			res.redirect('/burgers');
// 		});
// 	} else {
// 		res.redirect('/rangama');
// 	}

// });

module.exports = router;
