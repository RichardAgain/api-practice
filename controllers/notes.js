
const app = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

app.get('/', async (request, response) => {
  const notes = await Note.find({})
    .populate('user', {username: 1, name: 1})

  response.json(notes)
})
  
app.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).send({ "error": "ID not found" })
  }
})
  
app.delete('/:id', async (request, response) => {
  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
})
  
app.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findById(body.userId)
  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    user: user.id  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)  

  await user.save()  
  response.status(201).json(savedNote)
})
  
app.put('/:id', async (request, response) => {
  const updatedNote = await Note.findByIdAndUpdate(
    request.params.id, 
    request.body,
    { new: true, runValidators: true, context: 'query' })
  
  response.json(updatedNote)
})
  
module.exports = app
