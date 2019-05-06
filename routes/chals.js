const { exec } = require('child_process');
var express = require('express');
var router = express.Router();

router.get('/client', function(req, res) {
	res.render('client');
});

router.post('/client', function(req, res) {
	if (req.body.valid == 'true')
		res.send('flag{cl1ent_s1de_1s_the_dark_s1de}');
	else
		res.send('That\'s not right');
});

router.get('/posting', function(req, res) {
	res.send('<h1>This page takes POST data you have not submitted!</h1><!--username: admin--><!--password: 27cd614ecad7689e-->');
});

router.post('/posting', function(req, res) {
	if (req.body.username == 'admin' && req.body.password == '27cd614ecad7689e')
		res.send('<h1>Good job! flag{g3t!=p0st}</h1>');
	else
		res.send('<h1>On the right track, but not quite there...</h1>');
});

router.get('/header', function(req, res) {
	if (req.header('User-Agent') != 's3cr3t_4g3n7') {
		res.send('You\'re not using the correct user-agent!<!--s3cr3t_4g3n7-->');
	} else if (req.header('Referer') != 'nowhere.com') {
		res.send('make sure you\'re coming from nowhere.com');
	} else {
		res.send('flag{y0ur_bRa1n_iS_b1gGEr_th4n_mY_HeaD3r}');
	}
});

router.get('/calc', function(req, res) {
	res.render('calc');
});

router.post('/calc', function(req, res) {
	if (req.body.input.length > 25) {
		res.render('calc', { res: "Input too long" });
	} else {
		exec(`cd calc && python calc.py "${req.body.input.replace(/"/g, '\\"').replace(/'/g, '\\"')}"`, (error, stdout, stderr) => {
			if (error) {
				res.render('calc', { res: "Error" });
			} else {
				if (stdout.length > 15) {
					console.log(stdout, stdout.length);
					res.render('calc', { res: "Output too long" });
				} else {
					res.render('calc', { res: stdout });
				}
			}
		});
	}
});

module.exports = router;