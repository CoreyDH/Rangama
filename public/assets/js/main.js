$(function() {
    (function($) {

        var Rangama = function(playerName) {
            this.anagram = {};
            this.answered = {};
            this.chosen = [];
            this.lastInput = [];
            this.score = 0;
            this.bestWord = '';
            this.timeLimit = 2; // minutes
            this.time = this.timer();
        };

        Rangama.prototype.startGame = function() {
            this.resetScore();
            this.getRandomWord();
            this.time.pause();
            this.time.start();
        };

        Rangama.prototype.endGame = function() {

            var self = this;

            this.unloadEventListeners();

            var msg = 'The timer has ended, you scored: <strong>' + self.score + ' points</strong><br />';

            var options = {
                title: "Game Over",
                text: msg,
                type: "warning",
                showCancelButton: true,
                cancelButtonText: 'Back to Game',
            };

            if (self.score > 0) {
                options.confirmButtonColor = "#62c462";
                options.confirmButtonText = "Submit Your Score";
                options.input = 'text';
                options.inputPlaceholder = 'Enter your name.';
                options.inputValue = self.playerName || '';
                options.inputValidator = function(value) {
                    return new Promise(function(resolve, reject) {
                        if (value) {
                            resolve()
                        } else {
                            reject('You need to write something!')
                        }
                    })
                };
            }

            swal(options).then(function(playerName) {

                if (playerName) {
                    $.ajax({
                        method: 'POST',
                        url: '/rangama/score/submit',
                        data: { playerName: playerName, score: self.score },
                        dataType: 'json'
                    }).done(function(data) {
                        swal({
                            type: 'success',
                            title: 'Score Submitted!',
                            html: 'Click <a href="/rangama/top_scores" style="color:#ee5f5b">here</a> to view the top scores.'
                        });
                    });
                }



            });
        };

        Rangama.prototype.timer = function() {

            var self = this;

            var timerObj = {
                start: function() {

                    this.$el = $('#anagram-timer');
                    this.$el.css({ 'color': '#fff' });
                    this.limit = self.timeLimit * 60;

                    this.$el.text('');
                    this.clock = setInterval(function() {
                        timerObj.show();
                    }, 1000);

                },
                show: function() {

                    this.$el.text(Helper.formatTime(this.limit));
                    this.limit--;

                    if (this.limit < 30) {
                        this.$el.css({ 'color': 'red' });
                    }

                    if (this.limit < 0) {
                        this.stop();
                    }
                },
                pause: function() {
                    clearInterval(this.clock);
                },
                stop: function() {
                    this.pause();
                    self.endGame();
                },
                running: function() {
                    return this.limit > 0;
                }
            }

            return timerObj;
        }

        Rangama.prototype.newAnagram = function(word, resetScore) {

            var self = this;

            if (resetScore) {
                this.score = 0;
            }

            // var randomWord = Helper.getRandomWord()
            self.getAnagram(word).then(function(data) {
                self.loadTemplate('standardDisplay', data);
            });
        };

        Rangama.prototype.getRandomWord = function() {

            var self = this;

            $.get('/rangama/anagram/random', function(data) {
                self.setValues(data);
                self.loadTemplate('standardDisplay', data);
            });
        };

        Rangama.prototype.getAnagram = function(word) {

            var self = this;

            return $.get('/rangama/anagram/get/' + word.match(/[a-z]/gi).join(''), function(data) {

                // console.log(data);
                self.setValues(data);

                return data;
            })
        };

        Rangama.prototype.setValues = function(data) {
            var self = this;
            // console.log(data);
            self.anagram = data;
            self.chosen = data.word.split('');
            self.word = data.word;

            // Create an empty array of the anagrams
            self.answered = Helper.getEmptyKeys(data.anagrams);
            // console.log(self.answered);
        };

        Rangama.prototype.loadTemplate = function(name, data, selector) {

            var self = this;

            $.get('../templates/' + name + '.handlebars', function(templateData) {
                var template = Handlebars.compile(templateData);
                var html = template(data);

                $(selector || '#anagram-game').html(html);
                self.loadEventListeners();
                $("#user-input").focus();
            });
        };

        // Event Listeners
        Rangama.prototype.loadEventListeners = function() {

            var self = this;

            self.unloadEventListeners();

            $('.sweet-alert').on('click', '#submit-score', function(event) {

                var name = $(this).parent().find('#player-name').val();
                self.submitScore(name || 'guest');

            });

            $('#generate-word').on('click', function(e) {
                self.getRandomWord();
            });

            $('#submit-word').on('click', function(event) {
                self.submitWord($('#user-input').val().split(''));
            });

            $('#clear-word').on('click', function(event) {
                $('#user-input').val('');
            });

            $('body').on('keydown', function(event) {
                var keyCode = event.which;

                if (keyCode === 192) {
                    event.preventDefault();

                    var newScore = 0 - Helper.getScrabblePoints(self.word);

                    if ((self.score + newScore) < 0) {
                        self.resetScore();
                    } else {
                        self.addScore(newScore);
                    }

                    self.getRandomWord();

                }

            });

            $('#user-input').on('keydown', function(event) {

                var key = String.fromCharCode(event.which).toLowerCase();
                var keyCode = event.which;
                var keyIndex = self.chosen.indexOf(key);
                var deleteKeys = [8, 46]; // Backspace, Delete
                var otherKeys = [13, 45, 13, 127, 37, 38, 39, 40, 16, 192]; //  Arrow Keys, Insert
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
                            self.submitWord(currentValue);
                        }
                    }

                } else if (keyCode === 16) {

                    self.swapLetter();

                    $('.swap-warning').css({
                        visibility: 'visible'
                    });

                } else {
                    event.preventDefault();
                    // console.log(keyCode, 'prevented');
                }
            });

            $('#user-input').on('keyup', function(event) {
                var keyCode = event.which;

                if (keyCode === 16) {
                    $('.swap-warning').css('visibility', 'hidden');
                }

            });

            $('.chosen-letter').on('click', function(event) {
                var letter = $(this).data('letter');
                $('#user-input').val($('#user-input').val() + letter);
            });
        };

        Rangama.prototype.unloadEventListeners = function() {
            $('#user-input').off();
            $('body').off();
            $('#generate-word').off();
            $('#submit-word').off();
            $('#clear-word').off();
            $('.chosen-letter').off();
        };

        Rangama.prototype.submitWord = function(currentValue) {

            if (currentValue.length === 0) {
                return;
            }

            var self = this;

            // Check if word entered exists.
            if (self.checkWord(currentValue)) {
                self.displayError('Word was found: ' + currentValue.join('').toUpperCase(), 'success');

                // Check if all anagrams were found
                if (Helper.checkMatching(self.anagram.anagrams, self.answered)) {
                    self.getRandomWord();
                }
            } else {
                self.displayError('Word NOT found or already used!');
            }

            $('#user-input').val('');
        };

        Rangama.prototype.checkWord = function(userGuess) {

            var keyIndex = Helper.getKey(userGuess);
            var anagramArr = this.anagram.anagrams[keyIndex];

            if (anagramArr && this.answered[keyIndex].indexOf(userGuess.join('')) === -1) {
                userGuess = userGuess.join('');

                for (var i = 0; i < anagramArr.length; i++) {
                    if (userGuess === anagramArr[i].word) {
                        // console.log(userGuess);

                        // Add to answer object
                        this.answered[keyIndex].push(anagramArr[i].word);

                        // Add to score
                        this.addScore(anagramArr[i].score);

                        // Display word
                        this.displayWord(userGuess, keyIndex, i);

                        return true;
                    }
                }

            }

            return false;
        };

        Rangama.prototype.displayWord = function(word, key, index) {

            // console.log($('#'+key+'-words > li'));

            $('#' + key + '-words > li').eq(index).find('ul > li').each(function(i, value) {
                $(this).text(word[i]);
            });
        };

        Rangama.prototype.addScore = function(score) {
            if (!isNaN(score)) {
                this.score += score;
                this.displayScore();
            }
        };

        Rangama.prototype.resetScore = function() {
            this.score = 0;
            this.displayScore();
        };

        Rangama.prototype.displayScore = function() {
            $('#anagram-score > span').text(this.score);
        };

        Rangama.prototype.submitScore = function(playerName) {
            $.ajax({
                type: "POST",
                url: 'rangama/score/submit',
                data: {
                    name: playerName,
                    score: self.score
                },
                dataType: 'json',
            });
        };

        Rangama.prototype.displayError = function(msg, type) {
            var $alert = $('.alert');
            type = type || 'warning';

            $alert.text(msg).removeClass('alert-success').removeClass('alert-warning').addClass('alert-' + type);
            $alert.alert();

            $alert.stop().fadeIn();

            setTimeout(function() {
                $alert.fadeOut();
            }, 2000);
        };


        if ($('.standard-mode').length > 0) {

            $('[data-toggle="popover"]').popover();

            $('#start-game').on('click', function() {
                var game = new Rangama();

                game.startGame();
                $(this).parent().hide();
                $('#restart-game').removeClass('hidden').on('click', function() {
                    game.startGame();
                });
            });
        }



        // Helper functions
        var Helper = {
            arr_diff: function(a1, a2) {

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
            checkMatching: function(obj1, obj2) {

                var check = true;

                Object.keys(obj1).forEach(function(key) {
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
            getEmptyKeys: function(obj) {

                var newObj = {};

                Object.keys(obj).forEach(function(key) {
                    newObj[key] = obj[key].map(function(value) {
                        return [];
                    });
                });

                return newObj;
            },
            getKey: function(str) {
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

                return (minutes + seconds).toFixed(2).replace('.', ':');
            },
            getScrabblePoints: function(word) {
                var scrablePoints = [1, 3, 3, 2, 1, 4, 2, 4, 1, 8, 5, 1, 3, 1, 1, 3, 10, 1, 1, 1, 1, 4, 4, 8, 4, 10];
                var index;
                word = word.toLowerCase();

                total = 0;
                for (i = 0; i < word.length; i++) {
                    index = word.charCodeAt(i) - 97;
                    total = total + scrablePoints[index];
                }
                return (total);
            }
        }


        // Handlebar Helpers
        Handlebars.registerHelper("split", function(word) {
            return word.split('');
        });

        Handlebars.registerHelper("getScore", Helper.getScrabblePoints);

    })(jQuery);
})