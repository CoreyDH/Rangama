$(function () {
    (function ($) {

        var Rangama = function (playerName) {
            this.anagram = {};
            this.chosen = [];

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
                var allowedSpecialKeys = [8, 46, 45, 13, 127, 37, 38, 39, 40, 16]; // Backspace, Delete, Arrow Keys, Insert
                var $textInput = $(this).val();

                if (
                    keyIndex !== -1 // Check if key exists in word.
                    && $textInput.length <= self.anagram.word.length // Check if it is not greater than the available letters.
                    || allowedSpecialKeys.indexOf(keyCode) !== -1 // Special characters are always allowed.
                ) {
                    if(allowedSpecialKeys.indexOf(keyCode) === -1) {
                        self.chosen.splice(keyIndex, 1);
                    } else {
                        
                    }
                    

                } else {
                    event.preventDefault();
                    console.log(keyCode, 'prevented');
                }
            });
        };

        // Handlebar Helpers
        Handlebars.registerHelper("split", function (word) {
            return word.split('');
        });

        var player = new Rangama();

    })(jQuery);
})