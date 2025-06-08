const express = require('express')
const morgan = require('morgan')
const baseUrl = "/api/persons"
const app = express()

app.use(express.static('dist'))

app.use(express.json()) // super important!!!
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let people = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

/**
 * GET ALL PEOPLE
 */
app.get(baseUrl, (request, response) => {
    response.json(people)
})

/**
 * GET PERSON
 */
app.get(`${baseUrl}/:id`, (request, response) => {
    const id = request.params.id
    const person = people.find(person => person.id === id)
    if (!person) {
        response.status(404).end()
    } else {
        response.json(person)
    }
})

/**
 * DELETE PERSON
 */
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    people = people.filter(person => person.id !== id)
    response.status(204).end()
})

/**
 * CREATE PERSON
 */
app.post(baseUrl, (request, response) => {
    const { name, number } = request.body

    if (!name) return response.status(400).json({ error: 'Missing name' })
    if (!number) return response.status(400).json({ error: 'Missing number' })

    if (people.find(person => person.name === name)) {
        return response.status(400).json({ error: 'name must be unique' })
    }

    const id = String(Math.floor(Math.random() * 10000000))
    const person = { id, name, number }
    people = people.concat(person)

    response.json(person)
})


app.get('/info', (request, response) => {
    const html = `<p>Phonebook has info for ${people.length} people</p><p>${new Date(Date.now())}</p>`
    response.send(html)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})