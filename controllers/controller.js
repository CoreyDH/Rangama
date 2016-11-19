// // Routes Go Here
var express = require('express');
var router = express.Router();
var anagram = require('anagram');
var Helper = require('./helper.js');
var db = require('../models/word.js');


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

    db.retrieveHighScores(function (data) {
        // console.log(data);
        res.render('top_scores', data);
    });

});

router.get('/rangama/howto', function (req, res) {

    res.render('howto', {});

});

router.get('/rangama/anagram/get/:word', function (req, res) {

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

                // console.log(json);

                // console.log(anagrams);
                res.json(json);
            });
        });

    } else {

        // Send blank object
        res.json({});
    }

});

router.get('/rangama/anagram/random', function (req, res) {

    //
    // begin
    //
    getWords();

    function getWords() {

        // get the record and process it
        db.getWords(function (result) {    //read in the record

            var key, keyNumber, keyQuery, keyWord;
            var databaseMax = 180;
            var keysMax = 30;

            // objects for main app
            var wordObject = { word: '', score: 0 };

            var anagramObject = {
                word: '',
                anagrams: {}
            };

            anagramObject.word = result[0].item;  // put the scrambled letters in the json

            for (key = 1; key < keysMax; key++) {   // push the answers and their scores in the json
                keyNumber = key.toString();
                keyWord = result[0]['key' + keyNumber];   // creates a string like "result[0].key3" to reference data
                // keyWord = eval(keyQuery);        // turn data into a string called keyWord

                if (keyWord === 'undefined' && key < 6) {
                    getWords();
                    return;
                }

                // console.log(keyWord, keyWord.length);
                var score = Helper.getScrabblePoints(keyWord);   // calculates a scrabble score for that keyWord
                if (keyWord !== 'undefined') {

                    if (!anagramObject.anagrams[keyWord.length + ""]) {
                        anagramObject.anagrams[keyWord.length + ""] = [];
                    }

                    anagramObject.anagrams[keyWord.length + ""].push({
                        word: keyWord,
                        score: total
                    });
                } else {
                    continue;
                }
            }

            // console.log("stem = ", anagramObject.word);

            // Object.keys(anagramObject.anagrams).forEach(function(key) {
            //     for (i = 0; i < 30; i++) {
            //         if (!anagramObject.anagrams[key][i]) {
            //             break;
            //         }
            //         // console.log(anagramObject.anagrams.3[i]);
            //     }
            // });

            res.json(anagramObject);
        });
    }
});

router.get('/rangama/anagram/best/:word', function (req, res) {

    // console.log(req.params.word);

    anagramica.best(req.params.word, function (error, response) {
        if (error) {
            throw error;
        }

        console.log(response);

        res.json(Helper.getMinWordLength(response.best));
    });
});

router.post('/rangama/score/submit', function (req, res) {

    // console.log(req.body);
    // console.log('Score submission', req.body.playerName, req.body.score);

    var score = req.body.score;
    var playerName = req.body.playerName;
    if (score && playerName) {
        db.create({ topScore: score, playerName: playerName }, function (data) {
            // console.log(data);
            res.json(data);
        });
    }

});

module.exports = router;
