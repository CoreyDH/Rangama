// Helper function
module.exports = {
    filterAnagrams: function (obj) {

        var newObj = {};
        var self = this;

        Object.keys(obj).forEach(function (key) {

            // Ignore 2 letter words
            if (key === 2 || key === '2')
                return;

            // Flatten array, remove unnecessary w, f keys
            newObj[key] = obj[key].map(function (val) {
                return {
                    word: val.w,
                    score: self.getScrabblePoints(val.w)
                };
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
    },
    getScrabblePoints: function (word) {
        var scrablePoints = [1,3,3,2,1,4,2,4,1,8,5,1,3,1,1,3,10,1,1,1,1,4,4,8,4,10];
        var index;

        total = 0;
        for (i=0; i<word.length; i++) {
        index = word.charCodeAt(i) - 97;
        total = total + scrablePoints[index];
        }
        return (total);
    }
};