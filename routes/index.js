var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome to iTots' });
});

/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
    res.render('helloworld', { title: 'Hello, World!' });
});

router.get('/pollyCourse', function(req, res) {
    res.render('pollyHome', { title: 'Polly Course' });
});

router.get('/pollyCourse/:language', function(req, res) {
	var lang = req.url.split('/').slice(2);
    res.render('languageHome', { title: 'Course', lang: lang });
});

router.get('/pollyCourse/:language/:id', function(req, res) {
    res.render('slide', { title: 'Course' });
});

module.exports = router;
