// // Routes Go Here
var express = require('express');
var router = express.Router();
// var rangama = require('../models/model.js');

router.get('/', function (req, res) {
	res.redirect('/rangama');
});

router.get('/rangama', function (req, res) {
    res.render('index', {});
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
