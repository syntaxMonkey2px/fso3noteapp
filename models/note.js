const mongoose = require('mongoose')



// Define the Note schema
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  important: Boolean
})

// Set the toJSON method to customize the output
// when converting the document to JSON
// This is useful for removing sensitive information
// or formatting the output in a specific way

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id // remove _id field
    delete returnedObject.__v // remove version field
  },
})

module.exports = mongoose.model('Note', noteSchema)