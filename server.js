// Dependencies
// ============
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

// Handlebars
var exphbs = require('express-handlebars');
var hbs = require('handlebars');

app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

hbs.registerHelper("inc", function (value, options) {
	return parseInt(value) + 1;
});

// Routes
var routes = require('./controllers/controller.js');
app.use('/', routes);

app.listen(process.env.PORT || 3000, function () {
	console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});