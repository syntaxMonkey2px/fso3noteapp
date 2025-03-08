const http = require('http');
const express = require('express');
const cors = require('cors');
const path = require('path'); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist')); // Serve static files from 'dist' directory

// Content Security Policy
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'none'; script-src 'self';");
  next();
});

// Sample notes data
let notes = [
  { id: "1", content: "HTML is easy", important: true },
  { id: "2", content: "Browser can execute only JavaScript", important: false },
  { id: "3", content: "GET and POST are the most important methods of HTTP protocol", important: true }
];

// API routes
app.get('/api/notes', (request, response) => {
  response.json(notes);
});

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id;
  const note = notes.find(note => note.id === id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

app.post('/api/notes', (request, response) => {
  const maxId = notes.length > 0 ? Math.max(...notes.map(n => Number(n.id))) : 0;
  const note = request.body;
  note.id = String(maxId + 1);
  notes = notes.concat(note);
  console.log(note);
  response.json(note);
});

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id;
  notes = notes.filter(note => note.id !== id); // Remove the note
  response.status(204).end();
});

// Catch-all route for serving index.html for any other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});