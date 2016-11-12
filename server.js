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

app.engine('handlebars', exphbs({
	defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Routes
var routes = require('./controllers/controller.js');
app.use('/', routes);

var PORT = process.env.PORT || 3000;

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});