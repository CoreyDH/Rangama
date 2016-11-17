$(function () {
    (function ($) {
        
        var Rangama = function (playerName) {
            this.anagram = {};
            this.answered = {};
            this.chosen = [];
            this.lastInput = [];
            this.score = 0;
            this.bestWord = '';
            this.timeLimit = 5; // minutes
        };

        Rangama.prototype.startGame = function () {
            this.newAnagram();
            this.timer().start();
        };

        Rangama.prototype.endGame = function () {

            var self = this;

            this.unloadEventListeners();

            swal({
                title: "Game Over",
                text: "The timer has ended, you scored: X",
                type: "success",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Play Again?",
                closeOnConfirm: true
            }, function() {
                self.newAnagram(1);
            });
        };

        Rangama.prototype.timer = function () {
            
            var self = this;

            var timerObj =  {
                start: function () {

                    this.$el = $('#anagram-timer');
                    this.$el.css({ 'color': '#fff' });
                    this.limit = self.timeLimit * 60;

                    this.$el.text(this.limit);
                    this.clock = setInterval(function () {
                        timerObj.show();
                    }, 1000);

                },
                show: function () {

                    this.$el.text(Helper.formatTime(this.limit));
                    this.limit--;

                    if (this.limit < 30) {
                        this.$el.css({ 'color': 'red' });
                    }

                    if (this.limit < 0) {
                        this.stop();
                    }
                },
                pause: function () {
                    clearInterval(this.clock);
                    self.endGame();
                },
                stop: function () {
                    this.pause();
                },
                running: function() {
                    return this.limit > 0;
                }
            }

            return timerObj;
        }

        Rangama.prototype.newAnagram = function (resetScore) {

            var self = this;

            if(resetScore) {
                this.score = 0;
            }

            // var randomWord = Helper.getRandomWord()

            self.getAnagram('faewfwef2').then(function (data) {
                self.loadTemplate('standardDisplay', data);
            });
        };

        Rangama.prototype.getAnagram = function (word) {

            var self = this;

            return $.get('/rangama/anagram/' + word.match(/[a-z]/gi).join(''), function (data) {

                console.log(data);
                self.anagram = data;
                self.chosen = data.word.split('');
                self.word = data.word;

                // Create an empty array of the anagrams
                self.answered = Helper.getEmptyKeys(data.anagrams);
                console.log(self.answered);

                return data;
            })
        };

        Rangama.prototype.loadTemplate = function (name, data, selector) {

            var self = this;

            $.get('../templates/' + name + '.handlebars', function (templateData) {
                var template = Handlebars.compile(templateData);
                var html = template(data);

                $(selector || '#anagram-game').html(html);
                self.loadEventListeners();
            });
        };

        // Event Listeners
        Rangama.prototype.loadEventListeners = function () {

            var self = this;

            $('#generate-word').on('click', function (e) {
                console.log('fired button click');
                self.getAnagram('hello').then(function (data) {
                    self.loadTemplate('standardDisplay', data);
                });
            });

            $('#user-input').on('keydown', function (event) {

                var key = String.fromCharCode(event.which).toLowerCase();
                var keyCode = event.which;
                var keyIndex = self.chosen.indexOf(key);
                var deleteKeys = [8, 46]; // Backspace, Delete
                var otherKeys = [13, 45, 13, 127, 37, 38, 39, 40, 16]; //  Arrow Keys, Insert
                var isDeleteKey = deleteKeys.indexOf(keyCode) !== -1;
                var isOtherKey = otherKeys.indexOf(keyCode) !== -1;
                var isEnterKey = otherKeys.indexOf(keyCode) === 0;
                var isSpecialKey = otherKeys.concat(deleteKeys).indexOf(keyCode) !== -1; // Any special key
                var currentValue = $(this).val().split('');

                if (
                    keyIndex !== -1 // Check if key exists in word.
                    && currentValue.length <= self.anagram.word.length // Check if it is not greater than the available letters.
                    || isSpecialKey // Special characters are always allowed.
                ) {

                    // If it's a letter, remove from chosen array.
                    if (!isSpecialKey) {
                        // self.lastInput.push(self.chosen[keyIndex]); 
                        // self.chosen.splice(keyIndex, 1);
                    } else {
                        // If backspace or delete, re-add letters
                        // if(isDeleteKey) {
                        //     // Look at array diff, find the difference and add back to self.chosen
                        //     if(self.lastInput) {
                        //         console.log('latest:' + self.lastInput, 'chosen:' + self.chosen, 'text:' + currentValue);
                        //         self.chosen.concat(arr_diff(currentValue, self.lastInput));
                        //         self.lastInput = currentValue;
                        //     } 
                        // }

                        if (isEnterKey) {
                            // Check if word entered exists.
                            if (self.checkWord(currentValue)) {
                                self.displayError('Word was found: ' + currentValue.join('') + '!', 'success');

                                // Check if all anagrams were found
                                if (Helper.checkMatching(self.anagram.anagrams, self.answered)) {
                                    self.newAnagram('test');
                                }
                            } else {
                                self.displayError('Word not found or already used!');
                            }

                            $(this).val('');
                        }

                    }

                } else if(keyCode === 16) {

                    $('.swap-warning').css({
                        visibility : 'visible'
                    });

                } else {
                    event.preventDefault();
                    console.log(keyCode, 'prevented');
                }
            });

            $('#user-input').on('keyup', function(event) {
                var keyCode = event.which;

                if(keyCode === 16) {
                    $('.swap-warning').css('visibility', 'hidden');
                }

            });
        };

        Rangama.prototype.unloadEventListeners = function() {
            $('#user-input').off();

        };

        Rangama.prototype.checkWord = function (userGuess) {

            var keyIndex = Helper.getKey(userGuess);
            var anagramArr = this.anagram.anagrams[keyIndex];

            if (anagramArr && this.answered[keyIndex].indexOf(userGuess.join('')) === -1) {
                userGuess = userGuess.join('');

                for (var i = 0; i < anagramArr.length; i++) {
                    if (userGuess === anagramArr[i]) {
                        console.log(userGuess);

                        // Add to answer object
                        this.answered[keyIndex].push(anagramArr[i]);

                        // Add to score
                        // this.addScore(anagramArr.score);

                        // Display word
                        this.displayWord(userGuess, keyIndex, i);

                        return true;
                    }
                }

            }

            return false;
        };

        Rangama.prototype.displayWord = function (word, key, index) {

            // console.log($('#'+key+'-words > li'));

            $('#' + key + '-words > li').eq(index).find('ul > li').each(function (i, value) {
                $(this).text(word[i]);
            });
        };

        Rangama.prototype.addScore = function (score) {
            if (!isNaN(score)) {
                this.score += score;
            }
        };

        Rangama.prototype.displayScore = function () {
            $('#anagram-score').text(this.score);
        };

        Rangama.prototype.submitScore = function (playerName, totalScore) {
            $.ajax({
                type: "POST",
                url: 'rangama/score/submit',
                data: {
                    name: playerName,
                    score: totalScore
                },
                dataType: 'json',
            });
        };

        Rangama.prototype.displayError = function (msg, type) {
            var $alert = $('.alert');

            $alert.text(msg);
            $('.alert').alert();

            $alert.stop().css({
                visibility: 'visible'
            });

            setTimeout(function () {
                $('.alert').css({
                    visibility: 'hidden'
                });
            }, 500);
        };


        if($('.standard-mode').length > 0) {
            var game = new Rangama();

            game.startGame();
        }

        

        // Helper functions
        var Helper = {
            arr_diff: function (a1, a2) {

                var a = [], diff = [];

                for (var i = 0; i < a1.length; i++) {
                    a[a1[i]] = true;
                }

                for (var i = 0; i < a2.length; i++) {
                    if (a[a2[i]]) {
                        delete a[a2[i]];
                    } else {
                        a[a2[i]] = true;
                    }
                }

                for (var k in a) {
                    diff.push(k);
                }

                return diff;
            },
            checkMatching: function (obj1, obj2) {

                var check = true;

                Object.keys(obj1).forEach(function (key) {
                    if (obj2[key]) {
                        if (obj1[key].length !== obj2[key].length) {
                            check = false;
                        }
                    } else {
                        check = false;
                    }
                });

                return check;
            },
            getEmptyKeys: function (obj) {

                var newObj = {};

                Object.keys(obj).forEach(function (key) {
                    newObj[key] = obj[key].map(function (value) {
                        return [];
                    });
                });

                return newObj;
            },
            getKey: function (str) {
                var currentKeySetup = [
                    0,
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12
                ];

                return currentKeySetup[str.length];
            },
            formatTime: function(totalSeconds) { 
                var minutes = Math.floor(totalSeconds / 60);
                var seconds = (totalSeconds - minutes * 60) / 100;

                return (minutes + seconds).toFixed(2).replace('.',':');
            }
        }


        // Handlebar Helpers
        Handlebars.registerHelper("split", function (word) {
            return word.split('');
        });



    })(jQuery);
})