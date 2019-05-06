var express = require('express');
var router = express.Router();
var passport = require('passport');
var fs = require("fs");
var Account = require('../account');

var flags = {};
var challenges = JSON.parse(fs.readFileSync('challenges.json', 'utf8'));
for (let i = 0; i < challenges.length; i++) {
	let chal = challenges[i];
	flags[i] = chal.flag;
}

router.get('/', function(req, res) {
	res.render('index', { user: req.user });
});

router.get('/register', function(req, res) {
	res.render('register', { error: undefined });
});

router.post('/register', function(req, res, next) {
	Account.register(new Account({ username: req.body.username.trim(), solved: [], score: 0 }), req.body.password.trim(), function(err, account) {
		if (err) {
			return res.render('register', { error: err.message });
		}

		passport.authenticate('local')(req, res, function() {
			req.session.save(function(err) {
				if (err) {
					return next(err);
				}
				res.redirect('/');
			});
		});
	});
});

router.get('/login', function(req, res) {
	if (req.user) res.redirect('/');
	else res.render('login', { user: req.user, error: req.query.err });
});

router.post('/login', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.render('login', { error: "Login Failed." });
		}
		req.logIn(user, function(err) {
			if (err) { return next(err); }
			return res.redirect('/');
		});
	})(req, res, next);
});

router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

router.get('/challenges', function(req, res) {
	if (!req.user) res.send('You are not logged in! <br> <a href="/">Home</a>');
	else res.render('challenges', { challenges: challenges, user: req.user, submission: undefined });
});

router.post('/challenges', function(req, res) {
	if (!req.user) {
		res.send('You are not logged in! <br> <a href="/">Home</a>');
	} else if (req.user.solved.indexOf(req.body.problem) != -1) {
		res.send('You have already solved this problem! <br> <a href="/challenges">Go Back</a>');
	} else {
		var problem = parseInt(req.body.problem);
		var flag = req.body.flag.trim();
		var correct = '' + flag == flags[problem] || flag == 'flag{' + flags[problem] + '}' || flag == 'FLAG{' + flags[problem] + '}';
		//console.log(req.user.username, flags[problem], flag, correct);
		if (correct) {
			console.log(`${req.user.username} solved ${challenges[problem].name}`);
			req.user.solved.push(req.body.problem);
			req.user.score += challenges[problem].points;
			req.user.save();
			res.render('challenges', { challenges: challenges, user: req.user, submission: { challenge: problem, correct: true } });
			//res.send('Correct! <br> <a href="/challenges">Go Back</a>');
		} else {
			res.render('challenges', { challenges: challenges, user: req.user, submission: { challenge: problem, correct: false } });
			//res.send('Incorrect :( <br> <a href="/challenges">Go Back</a>');
		}
	}
	res.end();
});

router.get('/profile', function(req, res) {
	if (!req.query.u) {
		if (!req.user) res.send('You are not logged in! <br> <a href="/">Home</a>');
		else {
			res.redirect(`profile?u=${req.user.username}`);
		}
	} else {
		Account.findOne({ 'username': req.query.u }, function(err, u) {
			if (err) res.render('profile', { solved: solved, user: req.user, u: undefined });
			else {
				let solved = [];
				if (u) {
					for (let i of u.solved) {
						solved.push(challenges[i]);
					}
				}

				res.render('profile', { solved: solved, user: req.user, u: u });
			}
		});
	}
});

router.get('/leaderboard', function(req, res) {
	Account.find({}, null, { lean: true }, function (err, users) {
		res.render('leaderboard', { user: req.user, users: users });
	});
});

module.exports = router;