const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.getLoginPage = (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('auth/login', { layout: 'layouts/auth', isLoginPage: true });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.render('auth/login', { 
        layout: 'layouts/auth', 
        isLoginPage: true, 
        error: 'Invalid username or password' 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (isMatch) {
      req.session.user = {
        id: user._id,
        username: user.username
      };
      return res.redirect('/dashboard');
    } else {
      return res.render('auth/login', { 
        layout: 'layouts/auth', 
        isLoginPage: true, 
        error: 'Invalid username or password' 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.render('auth/login', { 
      layout: 'layouts/auth', 
      isLoginPage: true, 
      error: 'An error occurred during login' 
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error('Error destroying session:', err);
    res.redirect('/auth/login');
  });
};

exports.getSignupPage = (req, res) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('auth/signup', { layout: 'layouts/auth', isLoginPage: true });
};

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.render('auth/signup', { 
        layout: 'layouts/auth', 
        isLoginPage: true, 
        error: 'Username or email already exists' 
      });
    }

    const user = new User({ username, email, password });
    await user.save();

    req.session.user = {
      id: user._id,
      username: user.username
    };

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Signup error:', error);
    res.render('auth/signup', { 
      layout: 'layouts/auth', 
      isLoginPage: true, 
      error: 'Error creating user' 
    });
  }
};
