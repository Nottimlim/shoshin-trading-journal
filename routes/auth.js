const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

router.get('/login', (req, res) => {
    res.render('login');
  });

router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    req.session.user = user;
    res.redirect('/');
  } catch (error) {
    res.render('signup', { error: 'Error creating user' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      req.session.user = user;
      res.redirect('/');
    } else {
      res.render('login', { error: 'Invalid credentials' });
    }
  } catch (error) {
    res.render('login', { error: 'Error logging in' });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

module.exports = router;
