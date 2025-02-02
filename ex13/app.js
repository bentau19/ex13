const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');


app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));
app.use(session({
    secret: 'foo',
    saveUninitialized: false,
    resave: false
}));

const key = "Some super secret key shhhhhhhhhhhhhhhhh!!!!!";

function isLoggedIn(req, res, next) {
    if (req.session.username != null)
    return next()
    else
    res.redirect('/')
    }
    

const processLogin = (req, res) => {  
    let counter = parseInt(req.cookies.counter || "0");
    if (counter >= 3) {
        return res.status(403).send('Too many failed attempts.');
    }
    if (req.body.username === 'guest' && req.body.password === '123456') {
        res.cookie('counter', 0, { httpOnly: true });
        req.session.username = req.body.username;
        return res.status(201).send('Login successful');
    } else {
        res.cookie('counter', counter + 1, { httpOnly: true });
        return res.status(404).send('Invalid login');
    }
};

app.post('/login', processLogin);
app.get('/articles', isLoggedIn, (req, res) => {
    res.send("Welcome to the Articles section, you pass the login!");
});

app.listen(89, '0.0.0.0', () => {
    console.log('Server is running on port 89');
});