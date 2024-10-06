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

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  });
  
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.use(session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    }));

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/trades', require('./routes/trades'));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
