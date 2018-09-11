const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport')
const config = require('./config/database')


mongoose.connect(config.database);
var db = mongoose.connection;

db.once('open', function() {
  console.log('connected to MongoDB.')
});
db.on('error', (err) => {
  console.error.bind(console, 'connection error:')
})

const app = express()

let Article = require('./models/article')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitiaized: true
}))

app.use(require('connect-flash')());
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

require('./config/passport')(passport)

app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});


app.get('/', (req, res) => {
  Article.find({}, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', {
        title: 'Home',
        awards: data
      })
    }
  })
})

let articles = require('./routes/articles')
let users = require('./routes/users')

app.use('/articles',articles)
app.use('/users',users)

app.listen(3000, () => {
  console.log('App listening on port 3000!')
})
