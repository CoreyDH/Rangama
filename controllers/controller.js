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

router.get('/rangama/anagram/:word', function (req, res) {

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

            anagram.findAnagrams(req.params.word, function (err, anagrams) {
                console.log('`%s`: found %d anagrams', anagrams.input, anagrams.count);

                json.word = anagrams.input;
                json.anagrams = Helper.filterAnagrams(anagrams.items);

                // Get the longest words
                var anagramsKeys = Object.keys(anagrams.items); // Set keys to an array

                // Get the object from the last key in the anagrams.items object
                json.best = anagrams.items[anagramsKeys[anagramsKeys.length - 1]];

                // console.log(anagrams);
                res.json(json);
            });
        });

    } else {

        // Send blank object
        res.json({});
    }



    // scrabbler.get(req.params.word, function(error, data) {
    //     if(error) throw error;

    //     console.log(data);
    //     res.json(data);

    // });

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

// router.delete('/burgers/delete/:id', function(req, res) {

// 	if(req.params.id) {
// 		burger.delete(req.params.id, function(data) {
// 			res.redirect('/rangama');
// 		});
// 	} else {
// 		res.redirect('/rangama');
// 	}

// });

module.exports = router;
