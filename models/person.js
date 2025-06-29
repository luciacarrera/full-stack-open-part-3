const mongoose = require('mongoose')
const url = process.env.MONGODB_URI
mongoose.set('strictQuery', false)

console.log('connecting to', url)
mongoose.connect(url).then(() => { console.log('connected to MongoDB') }).catch(error => { console.log('error connecting to MongoDB:', error.message) })

const personSchema = new mongoose.Schema({
  name: { type: String, minLength: 3, required: true },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        console.log('validating...')
        // Remove all '-' before checking length
        const digitsOnly = v.replace(/-/g, '')
        console.log(digitsOnly)
        console.log(/^\d{2,3}-\d+$/.test(v))
        return digitsOnly.length >= 8 && /^\d{2,3}-\d+$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)