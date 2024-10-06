const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const port = process.env.PORT ? process.env.PORT : '3000';
const path = require('path')
const expressLayouts = require('express-ejs-layouts');
const tradeRoutes = require('./routes/trades');
const dashboardRoutes = require('./routes/dashboard');

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
  
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware
app.use(session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
    }));

app.use(expressLayouts);
app.set('layout', 'layout'); 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');
app.use('/trades', tradeRoutes);
app.use('/dashboard', dashboardRoutes);

// Middleware to make user available to all templates
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/trades', require('./routes/trades'));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
