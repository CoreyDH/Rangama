$(function () {
    (function ($) {

        var Rangama = function (playerName) {
            this.anagram = {};
            this.chosen = [];
            this.lastInput = [];
            this.score = 0;
            this.bestWord = '';

            this.newAnagram();
        };

        Rangama.prototype.newAnagram = function () {

            var self = this;

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
                var isEnterKey =  otherKeys.indexOf(keyCode) === 0;
                var isSpecialKey = otherKeys.concat(deleteKeys).indexOf(keyCode) !== -1; // Any special key
                var currentValue = $(this).val().split('');

                if (
                    keyIndex !== -1 // Check if key exists in word.
                    && currentValue.length <= self.anagram.word.length // Check if it is not greater than the available letters.
                    || isSpecialKey // Special characters are always allowed.
                ) {
                    
                    // If it's a letter, remove from chosen array.
                    if(!isSpecialKey) {
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

                        if(isEnterKey) {
                            // Check if word entered exists.
                            self.checkWord(currentValue);
                            $(this).val('');
                        }

                    }
                    

                } else {
                    event.preventDefault();
                    console.log(keyCode, 'prevented');
                }
            });
        };

        Rangama.prototype.checkWord = function(userGuess) {

            var anagramAray = this.anagram.anagrams[userGuess.length+''];
            if(anagramAray) {
                userGuess = userGuess.join('');

                for(var i=0; i < anagramAray.length; i++) {
                    if(userGuess === anagramAray[i]) {
                        console.log(userGuess);
                        

                        return true;
                    }
                }

            }

            return false;
        };

        Rangama.prototype.addScore = function(score) {
            if(!isNaN(score)) {
                this.score += score;
            } 
        };

        Rangama.prototype.submitScore = function(playerName, totalScore) {
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

        Rangama.prototype.displayError = function(msg) {
            var $alert = $('.alert');

            

            $alert.text(msg);
            $('.alert').alert();

            $alert.stop().show();

            setTimeout(function() {
                $('.alert').fadeOut();
            }, 500);
        };

        var game = new Rangama();

        // Helper functions
        function arr_diff (a1, a2) {

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
        };

        // Handlebar Helpers
        Handlebars.registerHelper("split", function (word) {
            return word.split('');
        });

        

    })(jQuery);
})