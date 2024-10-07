const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  if (req.session.user) {
    // If user is logged in, redirect to dashboard
    return res.redirect('/dashboard');
  }
  // If user is not logged in, render the login page
  res.render('auth/login', { layout: 'layouts/auth', isLoginPage: true });
});

module.exports = router;
