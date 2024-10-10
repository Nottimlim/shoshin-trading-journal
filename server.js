const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// View engine setup
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// Logging middleware
app.use((req, res, next) => {
  console.log('Session ID:', req.sessionID);
  console.log('Session:', req.session);
  next();
});

// Make user available to all templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/auth', require('./routes/auth.js'));
app.use('/dashboard', require('./routes/dashboard.js'));
app.use('/trades', require('./routes/trades.js'));
app.use('/', require('./routes/index.js'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  console.error('Stack:', err.stack);
  res.status(500).render('error', { 
    message: 'An error occurred', 
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

module.exports = app;