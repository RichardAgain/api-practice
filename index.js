
/// EXPORTS 

require('dotenv').config()
const express = require('express')
const app = express()
const Note = require('./models/note')

const cors = require('cors')

/// MIDDLEWARE

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

/// ROUTES

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
  .then(note => {
    if (note) {
      response.json(note)
    } else {
      response.status(404).send({ "error": "ID not found" }) 
    }
  })
  .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/notes', (request, response, next) => {
  const body = request.body

  const note = new Note ({
    important: Boolean(body.important),
    content: body.content,
  })
  
  note.save().then(savedNote => {
    response.json(savedNote)
  })
  .catch(err => next(err))
})

// app.put('/api/notes/:id', (request, response, next) => {
//   const body = request.body

//   const note = {
//     content: body.content,
//     important: body.important,
//   }

//   Note.findByIdAndUpdate(request.params.id, note, { new: true })
//     .then(updatedNote => {
//       response.json(updatedNote)
//     })
//     .catch(error => next(error))
// })

app.put('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndUpdate(
    request.params.id, 
    request.body,
    { new: true, runValidators: true, context: 'query' }
  ) 
  .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

/// ERROR MIDDLEWARE

const unknownEndpoint = (request, response) => {
  response.status(404).send({ "error": "Unknown endpoint" })
}
  
app.use(unknownEndpoint)

const errorHandler = (err, req, res, next) => {
  res.status(400).send({ error: err.message })
}

app.use(errorHandler)

///

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})