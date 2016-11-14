$(function () {
    (function ($) {

        getAnagram('faewfwef2').then(function (data) {
            loadTemplate('standardDisplay', data);
        });

        loadEventListeners();

        function getAnagram(word) {

            return $.get('/rangama/anagram/' + word.match(/[a-z]/gi).join(''), function (data) {

                console.log(data);
                return data;
            })
        }

        function loadTemplate(name, data, selector) {
            $.get('../templates/'+ name +'.handlebars', function(templateData) {
                var template = Handlebars.compile(templateData);
                var html = template(data);

                $(selector || '#anagram-game').html(html);
            });
        }

        function loadEventListeners() {
            $('#generate-word').on('click', function(e) {
                console.log('fired button click');
                getAnagram('hello').then(function (data) {
                    loadTemplate('standardDisplay', data);
                });
            });
        }


    })(jQuery);
})