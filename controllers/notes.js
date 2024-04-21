
const app = require('express').Router()
const Note = require('../models/note')

app.get('/', (request, response) => {
    Note.find({}).then(notes => {
      response.json(notes)
    })
  })
  
  app.get('/:id', (request, response, next) => {
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
  
  app.delete('/:id', (request, response, next) => {
    Note.findByIdAndDelete(request.params.id)
      .then(() => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })
  
  app.post('/', (request, response, next) => {
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
  
app.put('/:id', (request, response, next) => {
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
  
module.exports = app
