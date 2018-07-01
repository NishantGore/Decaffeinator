var express = require('express');
var app = express();
var ejs = require('ejs');
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
// var request = require()

// =============================================================
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(function (req, res, next) {
  req.requestTime = Date.now()
  next()
});
// =============================================================

mongoose.connect("mongodb://localhost/angel");

var entrySc = new mongoose.Schema({
	name: String,
	qty: Number,
	cal: Number,
	time: String
});
var entries = mongoose.model("entry", entrySc);

var basicSc = new mongoose.Schema({
	name: String,
	height: Number,
	weight: Number,
	pref: String,
	cal: Number
});
var basics = mongoose.model("basics", basicSc);

// =============================================================
app.get('/', function(req, res){
	// res.sendFile(__dirname + '/views/index.html');
	console.log(req.requestTime);
	res.render('index');
});

app.get('/found/:name/:qty', function(req, res){
	console.log(req.params.name);
	basics.find({'name': req.params.name}, function(err, response){
		if(!err){
			// if(response.length)
			var calories = parseInt(req.params.qty)*response[0].cal;
			var obj = {
				name: req.params.name,
				qty: parseInt(req.params.qty),
				cal: calories,
				time: req.requestTime
			};
			entries.create(obj, function(err, response){
				if(err){
					console.log("Couldn't enter in entries");
					res.send('err');
				}else{
					console.log(response);
					res.send('ok');
				}
			})
		}else{
			console.log('Not found name!!!');
			res.send('not ok');
		}
	});
});

app.get('/main/:name', function(req, res){
	basics.find({"name": req.params.name}, function(err, bresponse){
		if(err){
			console.log("Couldn't find basics");
			res.send('error');
		}else{
			entries.find({"name": req.params.name},[],{
					sort: {
						"time": -1
					}
				}, function(err, eresponse){
					if(err){
						console.log("Couldn't find entries");
						res.send('error');
					}else{
						res.render('index', {
							entries: JSON.stringify(eresponse),
							basics: JSON.stringify(bresponse)
						});
					}
			});
		}
	});
});

app.get('/main/:name/history', function(req, res){
	basics.find({"name": req.params.name}, function(err, bresponse){
		if(err){
			console.log("Couldn't find basics");
			res.send('error');
		}else{
			entries.find({"name": req.params.name},[],{
					sort: {
						"time": -1
					}
				}, function(err, eresponse){
					if(err){
						console.log("Couldn't find entries");
						res.send('error');
					}else{
						res.render('history', {
							entries: JSON.stringify(eresponse),
							basics: JSON.stringify(bresponse)
						});
					}
			});
		}
	});
});

app.get('/admin', function(req, res){
	entries.find({}, function(err, response){
		if(!err){
			console.log(response);
			res.render('admin', {entries: JSON.stringify(response)});
		}else
			res.send('error');
	});
});

app.get('/register/:name', function(req, res){
	if(req.params.name!='n')
	{
		basics.find({"name": req.params.name}, function(err, response){
			if(!err){
				res.render('register',{flag: true, basics: JSON.stringify(response)});
			}else
				res.send('error');
		});
	}
	else
		res.render('register', {flag: false});
});

app.get('/register', function(req, res){
	res.redirect('/register/n');
});

app.post('/register', function(req, res){
	var obj = {
		name: req.body.name,
		height: parseInt(req.body.height),
		weight: parseInt(req.body.weight),
		pref: ps[parseInt(req.body.pref)].pref,
		cal: ps[parseInt(req.body.pref)].cals
	};
	basics.update(
		{
			name: req.body.name
		},obj,{
			upsert:true
		},function(err, response){
			if(!err){
				console.log(response);
				res.send('success');
				//===================================================MAKE IMAGE CLICK REQUEST=============================
			}else
				res.send('fail');
		}
	);
	// res.send("received");
});
// =============================================================
app.listen(6660,function(){
	console.log('On port 6660');
});
// ==============================================================
var ps = [
	{
		pref: "Cappuccino",
		cals: 90
	},{
		pref: "Espresso",
		cals: 7
	},{
		pref: "Latte",
		cals: 100
	}
];