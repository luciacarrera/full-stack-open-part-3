require('dotenv').config()
const express = require('express')
const morgan = require('morgan')

const Person = require('./models/person')
const baseUrl = "/api/persons"
const app = express()


app.use(express.static('dist'))

app.use(express.json()) // super important!!!
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

/**
 * GET ALL PEOPLE
 */
app.get(baseUrl, (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

/**
 * GET PERSON
 */
app.get(`${baseUrl}/:id`, (request, response) => {
    const id = request.params.id
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
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

    // if (Person.find(person => person.name === name)) {
    //     return response.status(400).json({ error: 'name must be unique' })
    // }

    // const id = String(Math.floor(Math.random() * 10000000))
    const person = new Person({ name, number })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})


app.get('/info', (request, response) => {
    const html = `<p>Phonebook has info for ${people.length} people</p><p>${new Date(Date.now())}</p>`
    response.send(html)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})