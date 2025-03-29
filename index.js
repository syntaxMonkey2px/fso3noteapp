//.env before Note to ensure that the environment variables from the .env file are available globally b
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path'); 
const Note = require('./models/note');


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
app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if(note){
      response.json(notes)
      }else{
        response.status(404).end();
      }
    })
    .catch(error => next(error))
    })




app.post('/api/notes', (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });
  
  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => {
      console.error(error);
      response.status(500).json({
        error: 'Failed to save note'
      });
    })
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

const errorHandler = (error, request, response, next) =>{
  console.error(error.message)

  if(error.name === 'CastError'){
    return response.status(400).send({ error: 'malformatted id'})
  }
  
  next(error)
}

app.use(errorHandler)


// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});