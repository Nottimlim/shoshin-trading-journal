const bcrypt = require('bcryptjs');
const User = require('../models/User.js');

exports.getLoginPage = (req, res) => {
  if (req.session.user) {
    console.log('User already logged in, redirecting to dashboard');
    return res.redirect('/dashboard');
  }
  res.render('auth/login', { layout: 'layouts/auth', isLoginPage: true });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log(`Attempting login for username: ${username}`);
    const user = await User.findOne({ username });
    
    if (!user) {
      console.log(`Login failed: User not found for username: ${username}`);
      return res.render('auth/login', { 
        layout: 'layouts/auth', 
        isLoginPage: true, 
        error: 'Invalid username or password' 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (isMatch) {
      console.log(`Login successful for user: ${username}`);
      req.session.user = {
        id: user._id,
        username: user.username
      };
      console.log('Session after login:', req.session);
      return res.redirect('/dashboard');
    } else {
      console.log(`Login failed: Incorrect password for username: ${username}`);
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
  console.log('Logging out user:', req.session.user);
  req.session.destroy((err) => {
    if (err) console.error('Error destroying session:', err);
    res.redirect('/auth/login');
  });
};

exports.getSignupPage = (req, res) => {
  if (req.session.user) {
    console.log('User already logged in, redirecting to dashboard');
    return res.redirect('/dashboard');
  }
  res.render('auth/signup', { layout: 'layouts/auth', isLoginPage: true });
};

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    console.log(`Attempting signup for username: ${username}, email: ${email}`);
    
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      console.log(`Signup failed: Username or email already exists: ${username}, ${email}`);
      return res.render('auth/signup', { 
        layout: 'layouts/auth', 
        isLoginPage: true, 
        error: 'Username or email already exists' 
      });
    }

    const user = new User({ username, email, password });
    await user.save();

    console.log(`Signup successful for user: ${username}`);
    req.session.user = {
      id: user._id,
      username: user.username
    };
    console.log('Session after signup:', req.session);

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