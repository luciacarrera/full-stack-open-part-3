const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
} else if (process.argv.length === 3) {
    setupMongo(process.argv[2])
    findPeople()
} else if (process.argv.length === 4) {
    console.log("missing phonenumber")
    process.exit(1)
} else if (process.argv.length === 5) {
    setupMongo(process.argv[2])
    createPerson(process.argv[3], process.argv[4])
} else {
    console.log("Too many arguments")
    process.exit(1)
}

function setupMongo(password) {

    const url = `mongodb+srv://luciaacarreraa:${password}@cluster0.q3wlf.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

    mongoose.set('strictQuery', false)

    mongoose.connect(url)

}

function createPerson(name, number) {
    const person = new Person({
        name,
        number,
    })

    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}

function findPeople() {
    Person
        .find({})
        .then(persons => {
            console.log("phonebook:")
            persons.map(person => console.log(person.name, person.number))
            mongoose.connection.close()
        })
}