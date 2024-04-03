
const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())

app.use(express.static('dist'))

app.use(express.json())

let notes = [
  {
      id: 1,
      content: "HTML is easy",
      important: true
  },
  {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
  },
  {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
  
app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(n => n.id == id)

  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
  // response.send('{"hola hola": "epaa"}')
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  
  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    response.statusMessage = 'does not include content'
    return response.status(400).json({
      error: "content missing"
    })
  }  

  console.log(Boolean(''))
  
  const note = {
    id: notes.length + 1,
    important: Boolean(body.important),
    content: body.content,
  }
  
  notes = notes.concat(note)
  response.json(note)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ "error": "Unknown endpoint" })
}
  
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})