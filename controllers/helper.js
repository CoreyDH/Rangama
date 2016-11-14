// Helper function
module.exports = {
    filterAnagrams: function (obj) {

        var newObj = {};

        Object.keys(obj).forEach(function (key) {

            // Ignore 2 letter words
            if (key === 2 || key === '2')
                return;

            // Flatten array, remove unnecessary w, f keys
            newObj[key] = obj[key].map(function (val) {
                return val.w;
            });

        });

        return newObj;
    },
    getMinWordLength: function (arr, minLength) {

        if (Array.isArray(arr)) {
            return arr.filter(function (value) {
                return value.length >= (minLength || 3) && typeof value === 'string';
            });
        } else {
            return [];
        }
    },
    getScore: function (str) {
        var newArr = str.split('').map(function (character) {
            
        });
    }
}