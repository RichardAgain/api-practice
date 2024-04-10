
/// EXPORTS 

require('dotenv').config()
const express = require('express')
const app = express()
const Note = require('./models/note')

const cors = require('cors')

///

app.use(cors())

app.use(express.static('dist'))

app.use(express.json())

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
  
app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})

// app.delete('/api/notes/:id', (request, response) => {
//   const id = Number(request.params.id)
//   notes = notes.filter(note => note.id !== id)
  
//   response.status(204).end()
// })

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    response.statusMessage = 'does not include content'
    return response.status(400).json({ error: "content missing" })
  }  
    
  const note = new Note ({
    important: Boolean(body.important),
    content: body.content,
  })
  
  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ "error": "Unknown endpoint" })
}
  
app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})