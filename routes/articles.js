const express = require('express');
const router = express.Router();

let Article = require('../models/article');
let User = require('../models/user');

router.get('/add', ensureAuthenticated, function(req, res) {
  res.render('add_article', {
    title: 'Add Prize'
  })
})

router.get('/edit/:id', ensureAuthenticated, function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    res.render('edit_article', {
      title: 'Edit Article',
      article: article
    });
  });
});

router.post('/add', function(req, res) {
  req.checkBody('prize', 'Prize is required').notEmpty()
  // req.checkBody('athlete', 'Athlete is required').notEmpty()
  req.checkBody('describe', 'Describe is required').notEmpty()

  let errors = req.validationErrors()

  if (errors) {
    res.render('add_article', {
      title: 'Add Prize',
      error: errors
    })
  } else {
    let article = new Article();
    article.prize = req.body.prize
    article.athlete = req.body.athlete
    article.describe = req.body.describe

    article.save(function(err) {
      if (err) {
        console.log(err)
      } else {
        req.flash('success', 'Article Added')
        res.redirect('/')
      }
    })
  }
})

router.post('/edit/:id', function(req, res) {
  let article = {};
  article.prize = req.body.prize
  //article.athlete = req.body.athlete
  article.describe = req.body.describe
  let query = {
    _id: req.params.id
  }

  Article.update(query, article, function(err) {
    if (err) {
      console.log(err)
    } else {
      req.flash('success', 'Article Updated')
      res.redirect('/')
    }
  })
})

router.delete('/:id', function(req, res) {
  if (!req.user._id) {
    res.status(500).send();
  }

  let query = {
    _id: req.params.id
  }

  Article.findById(req.params.id, function(err, article) {
    Article.remove(query, function(err) {
      if (err) {
        console.log(err);
      }
      res.send('Success');
    });

  });
});


router.get('/:id', function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    res.render('article', {
      article: article
    });
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}


module.exports = router
