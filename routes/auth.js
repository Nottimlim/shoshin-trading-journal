const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.render('auth/signup', { error: 'Username or email already exists' });
    }
    const user = new User({ username, email, password });
    await user.save();
    req.session.user = user;
    res.redirect('/');
    } catch (error) {
    console.error(error);
      res.render('auth/signup', { error: 'Error creating user' });
  }
});
router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/login', async (req, res) => {
    try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.user = user;
        res.redirect('/');
        } else {
        res.render('auth/login', { error: 'Invalid credentials' });
        }
        } catch (error) {
    console.error(error);
          res.render('auth/login', { error: 'Error logging in' });
        }
    });

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/');
    }
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

module.exports = router;
