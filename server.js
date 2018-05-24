require('dotenv').load();

const express = require('express');
const pug = require('pug');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

var app = express();

app.set('view engine', 'pug');

app.use((req, res, next) => {
	const now = new Date().toString();
	const log = `${now}: ${req.method} ${req.url}`;
	console.log(log);
	fs.appendFile('server.log', log + '\n', err => {
		if (err) {
			console.log('Unable to append server.log');
		}
	});
	next();
});

app.use((req, res, next) => {
	if (process.env.MAINTENANCE === true) {
		res.render('maintenance', {
			pageTitle: 'Maintenance mode',
			message: 'We will be back soon',
		});
	} else {
		next();
	}
});

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
	res.render('home', {
		pageTitle: 'Home',
		welcomeMessage: 'Welcome!',
	});
});

app.get('/about', (req, res) => {
	res.render('about', {
		pageTitle: 'About',
	});
});

app.get('/projects', (req, res) => {
	res.render('projects', {
		pageTitle: 'Projects',
	});
});

app.get('/bad', (req, res) => {
	res.send({
		errorMessage: 'Unable to handle request',
	});
});

app.listen(PORT, () => {
	console.log(`Server is up on port ${PORT}`);
});
