const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Book = require('./Book.model');

const app = express();
const port = 8080;
const dbURI = 'mongodb://localhost:27017/rajdb33'; // Better to specify port

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB using modern promise-based approach
mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

// Root route
app.get('/', (req, res) => {
  res.send('happy to be here');
});

// Get all books
app.get('/book', async (req, res) => {
  try {
    const books = await Book.find({});
    res.setHeader('Cache-Control', 'no-cache, no-store');
    res.json(books);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get book by ID
app.get('/book/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.json(book);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Add new book
app.post('/book', async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.json(savedBook);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Update book
app.put('/book/:id', async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: { title: req.body.title } },
      { new: true, upsert: true }
    );
    res.json(updatedBook);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete book
app.delete('/book/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    res.json(deletedBook);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});