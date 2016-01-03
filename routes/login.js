const express = require('express'),
      User = require('../lib/models/user'),
      router = express.Router();

router.use(function(req, res, next) {

  if (req.url == '/bye') {
    return next();
  }

  if (req.session.loggedIn) {
    res.redirect('/admin');
  } else {
    next();
  }

});

router.get('/', function(req, res, next) {

  const tags = {
    site: {
      name: 'Volkspark'
    },
    layout: false
  };

  req.session.loggedIn = false;
  res.render('login', tags);

});

router.get('/reset-password', function(req, res) {
  res.send('You\'re such a bad boy!');
});

router.get('/bye', function(req, res) {
  req.session.loggedIn = false;
  res.redirect('/login');
});

router.post('/', function(req, res) {

  const username = req.body.username,
        password = req.body.password;

  if (!username || !password) {
    res.sendStatus(401);
    return;
  }

  const query = User.where({ _id: req.body.username });

  query.findOne(function(err, user) {

    if (!user) {
      res.sendStatus(401);
      return;
    }

    user.tryPassword(req.body.password, function(err, isMatch) {

      if (err) {
        throw err;
      }

      if (isMatch) {
        req.session.loggedIn = true;
        res.sendStatus(200);
        return;
      }

      res.sendStatus(401);

    });

  });

  console.log(req.body);

});

module.exports = router;
