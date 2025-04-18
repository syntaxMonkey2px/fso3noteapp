//.env before Note to ensure that the environment variables from the .env file are available globally b
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const path = require('path')
const Note = require('./models/note')


const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static('dist')) // Serve static files from 'dist' directory

// Content Security Policy
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', 'default-src "none" script-src "self"')
  next()
})

// Sample notes data



// API routes

app.get('/api/notes', (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {

  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})



app.post('/api/notes', (request, response, next) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))

})

app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(() =>
      response.status(204).end()
    )
    .catch(error => next(error))

})


// Catch-all route for serving index.html for any other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message})
  }

  next(error)
}

app.use(errorHandler)


// Start the server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})