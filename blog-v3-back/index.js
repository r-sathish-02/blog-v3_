const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const passportMongoose = require('passport-local-mongoose');
const LocalStrategy = require('passport-local').Strategy;
const cors = require('cors');
const MongoStore = require('connect-mongo');

require('dotenv').config();

/**
 * Build a safe Mongo URI using env vars.
 * encodeURIComponent handles special chars in the password (@, /, :, ?, &, =, #, etc.)
 * Replace the host/appName below if your Atlas cluster name/id differs.
 */
const MONGO_URI = `mongodb+srv://${process.env.MYDBUSER}:${encodeURIComponent(process.env.MYDBPASS)}@blog-cluster.h8sbpo5.mongodb.net/blogDB-v2?retryWrites=true&w=majority&appName=Blog-cluster`;

// Connect to MongoDB
mongoose.connect(MONGO_URI);

// App
const app = express();

// CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Parsers
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Sessions (store in Mongo)
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGO_URI,
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60, // 14 days
  }),
  cookie: { secure: false }, // dev over http
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Schemas
const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  mobile: Number,
});

const textSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
});

// Plugins / Models
userSchema.plugin(passportMongoose);
const Text = mongoose.model('Text', textSchema);
const User = mongoose.model('User', userSchema);

// Passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.get('/current_user', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.json({ user: req.user });
  }
  res.json({ user: null });
});

app.post('/login', passport.authenticate('local'), (req, res) => {
  res.status(200).json({ user: req.user });
});

app.post('/register', (req, res, next) => {
  const newUser = new User({
    name: req.body.name,
    username: req.body.username,
    mobile: req.body.mobile,
  });

  User.register(newUser, req.body.password, (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    req.login(user, (err2) => {
      if (err2) return next(err2);
      return res.json({ user });
    });
  });
});

app.get('/posts', async (req, res) => {
  const response = await Text.find();
  res.json(response);
});

app.post('/compose', async (req, res) => {
  try {
    const newText = new Text({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
    });
    await newText.save();
    res.status(200).send('Text Saved Successfully');
  } catch (e) {
    res.status(500).send('Failed to save text');
  }
});

app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((err2) => {
      if (err2) return next(err2);
      res.json({ message: 'Logout successful' });
    });
  });
});

// Start server
app.listen(8000, () => {
  console.log('Server live at 8000');
});
