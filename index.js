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
app.get(`${baseUrl}/:id`, (request, response, next) => {
    const id = request.params.id
    Person.findById(id).then(person => {
        if (person) { response.json(person) }
        else {
            response.status(404).end()
        }
    }).catch(error => next(error))
})

/**
 * DELETE PERSON
 */
app.delete(`${baseUrl}/:id`, (request, response, next) => {
    const id = request.params.id
    Person.findByIdAndDelete(id).then(result => {
        response.status(204).end()
    }).catch(error => next(error))
})

/**
 * CREATE PERSON
 */
app.post(baseUrl, (request, response, next) => {
    const { name, number } = request.body

    if (!name) return response.status(400).json({ error: 'Missing name' })
    if (!number) return response.status(400).json({ error: 'Missing number' })

    Person.findOne({ name }).then(result => {
        if (result) {
            return response.status(400).json({
                error: 'Name already in phonebook'
            })
        }
        const person = new Person({ name, number })

        return person.save().then(savedPerson => {
            response.json(savedPerson)
        })

    }
    ).catch(error => next(error))

})

/**
 * MODIFY PERSON
 */
app.put(`${baseUrl}/:id`, (request, response, next) => {

    Person.findById(request.params.id).then(existingPerson => {
        if (!existingPerson) {
            return response.status(400).json({
                error: 'Name is not in phonebook'
            })
        }
        existingPerson.number = request.body.number

        return existingPerson.save().then(savedPerson => {
            response.json(savedPerson)
        })

    }
    ).catch(error => next(error))

})

/**
 * GET INFO
 */
app.get('/info', (request, response, next) => {
    Person.find({}).then(people => {
        const html = `<p>Phonebook has info for ${people.length} people</p><p>${new Date(Date.now())}</p>`
        return response.send(html)
    }
    ).catch(error => next(error))
})



const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})