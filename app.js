var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var AWS = require("aws-sdk");
var bodyParser = require('body-parser');
//var config = require('./config');
var availableLanguages = ['hindi', 'french', 'spanish', 'english']
var port = "3000"
var domain = "ec2-34-207-163-214.compute-1.amazonaws.com"
var protocol = "http"
var home_url = protocol+"://"+domain+":"+port
//var home_url = domain+":"+port

console.log(home_url);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.listen(3000, () => console.log('pollyCourse API listening on port 3000!'))

var docClient = new AWS.DynamoDB.DocumentClient();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('view engine', 'jade');


app.get('/pollyCourse', function (req, res) {
  res.render('pollyHome', {title: 'Home'});
});

app.get('/learningCourse', function (req, res) {
  res.render('learningHome', {title: 'Learn'});
});

app.get('/pollyCourse/:language', function(req, res){
  var lang = req.url.split('/').slice(2)[0];
  console.log(lang);
  var next_url = home_url+'/pollyCourse/'+lang+'/1';
  console.log(next_url); 
  res.render('languageHome', {title: 'Course', lang: lang, url: next_url})
  
});

app.get('/learningCourse/:categories', function(req, res) {
  var category = req.url.split('/').slice(2)[0];
  console.log(category)
  var next_url = home_url+'/learningCourse/'+category+'/1';
  console.log(next_url);
  res.render('categoryHome', {title: 'Learning Course', category: category, url: next_url})
});


app.get('/pollyCourse/:language/:id', function (req, res) {
  //console.log("here");
  var voice = 'Aditi';
  var url_parts = req.url.split('/').slice(2);
  var language = url_parts[0];
  if (language == 'hindi'){
    voice = 'Aditi';
  }
  else if (language == 'english'){
    voice = 'Joanna';
  }
  else if (language == 'french'){
    voice = 'Mathieu';
  }
  else if (language == 'german'){
    voice = 'Marlene';
  }
  else if (language =='spanish'){
    voice = 'Enrique'
  }
  var voiceNum = url_parts[1];
  var phraseID = voice+'_Phrase'+voiceNum
  var params = {
    TableName : "pollyCourse",
    KeyConditionExpression: "#id = :id",
    ExpressionAttributeNames:{
      "#id": "id"

    },
    ExpressionAttributeValues: {
      ":id": phraseID
    }
};
docClient.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        console.log(data);
        console.log(data.Items[0].text);
        var nextSlide = parseInt(voiceNum)+1;
        var previousSlide = parseInt(voiceNum)-1;
        console.log(previousSlide)
//        var previous_url = home_url+'/pollyCourse/'+language+'/'+previousSlide;
 //       res.render('slide', { title: 'Course', text: data.Items[0].text, previous_url: previous_url, audio_url:data.Items[0].url});
        var next_url = home_url+'/pollyCourse/'+language+'/'+nextSlide;
        res.render('slide', { title: 'Course', text: data.Items[0].text, next_url: next_url, audio_url:data.Items[0].url});
        
        if(data.Items[0].text.LastEvaluatedKey = "undefined") {
          res.render('finish', { title: 'Course Completed'})
        }
        //res.send(data.Items)
        // data.Items.forEach(function(pollyCourse) {
        //   console.log(pollyCourse.id, pollyCourse.voice, pollyCourse.text);
        // });
    }
});
});

app.get('/learningCourse/:categories/:id', function (req, res) {
  //console.log("here");
  //var voice = 'Aditi';
  var url_parts = req.url.split('/').slice(2);
  var category = url_parts[0];
  var categoryNum = url_parts[1];
  var imageID = category+'/'+category+'_'+categoryNum
  console.log(imageID);
  var params = {
    TableName : "courseImages",
    KeyConditionExpression: "#id = :id",
    ExpressionAttributeNames:{
      "#id": "filename"

    },
    ExpressionAttributeValues: {
      ":id": imageID
    }
};

docClient.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        console.log(data);
        console.log(data.Items[0].text);
        var nextSlide = parseInt(categoryNum)+1;
        var previousSlide = parseInt(categoryNum)-1;
        console.log(previousSlide)
//        var previous_url = home_url+'/pollyCourse/'+language+'/'+previousSlide;
 //       res.render('slide', { title: 'Course', text: data.Items[0].text, previous_url: previous_url, audio_url:data.Items[0].url});
        var next_url = home_url+'/learningCourse/'+category+'/'+nextSlide;
        res.render('learningslide', { title: 'Course', text: data.Items[0].text, next_url: next_url, S3url:data.Items[0].S3url});

//        if(data.Items[0].text.LastEvaluatedKey = "undefined") {
//          res.render('finish', { title: 'Course Completed'})
//        }
        //res.send(data.Items)
        // data.Items.forEach(function(pollyCourse) {
        //   console.log(pollyCourse.id, pollyCourse.voice, pollyCourse.text);
        // });
    }
});
});
app.get('/learningCourse/:categories/quiz/:id', function (req, res) {
  var url_parts = req.url.split('/').slice(2);
  var category = url_parts[0];
  var numberOfSlidesInEachCategory = 4;
  var categoryNum = url_parts[2];
  console.log(categoryNum);
  var randomCategoryNum = numberOfSlidesInEachCategory;
  do{
  	randomCategoryNum = Math.floor(Math.random() * numberOfSlidesInEachCategory) + 1;
  }while(randomCategoryNum==categoryNum);
  console.log(randomCategoryNum);
  
  var image1ID = category+'/'+category+'_quiz_'+categoryNum
  var image2ID = category+'/'+category+'_quiz_'+randomCategoryNum
  console.log(image1ID);
  console.log(image2ID);
  var params1 = {
    TableName : "courseImages",
    KeyConditionExpression: "#id = :id",
    ExpressionAttributeNames:{
      "#id": "filename"

    },
    ExpressionAttributeValues: {
      ":id": image1ID
    }
};
  var params2 = {
    TableName : "courseImages",
    KeyConditionExpression: "#id = :id",
    ExpressionAttributeNames:{
      "#id": "filename"

    },
    ExpressionAttributeValues: {
      ":id": image2ID
    }
};

docClient.query(params1, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
    	var wrongImageData = function getWrongImageData(params, docClient){
        docClient.query(params, function(err, data) {
          if (err) {
          console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
          } else {
              console.log('here');
              var wrongImageURL = data.Items[0].S3url;
              var wrongImageText = data.Items[0].text;
              console.log(wrongImageURL);
              console.log(wrongImageText);
              var wrongImageData1 = {wrongImageURL: wrongImageURL, wrongImageText: wrongImageText};
              console.log(wrongImageData);
              return wrongImageData1;
              }
          });
          var nextSlide = parseInt(categoryNum)+1;
          var next_url = home_url+'/learningCourse/'+category+'/quiz_/'+nextSlide;
          var rightImageURL = data.Items[0].S3url;
          console.log(rightImageURL);
	  console.log(wrongImageData.wrongImageURL);
          var rightImageText = data.Items[0].text;
          var rightImageLabel = data.Items[0].labels[0];
          console.log(rightImageLabel);
    
//});
          res.render('quiz', 
	        {	
		title: 'quiz', 
		quiz_label_right: rightImageLabel, 
		rightImageURL: rightImageURL, 
		wrongImageURL: wrongImageData.wrongImageURL, 
		rightImageText: rightImageText, 
		wrongImageText: wrongImageData.wrongImageText, 
		next_url: next_url
        	});
	
}

});
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
