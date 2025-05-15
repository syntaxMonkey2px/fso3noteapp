const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const content = process.argv[3]
const important = process.argv[4] === 'true'

const url = `mongodb+srv://syntaxmonkey2px:${password}@cluster0.4ko9m.mongodb.net/test-noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  important: Boolean
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: content,
  important: important,
})

// test code
note.save().then(result => {
  console.log('note saved!', result)
  // mongoose.connection.close()//
})

Note.find({}).then(result => {
  result.forEach(note => {
    console.log('operation returned the following notes',note)
  })
  mongoose.connection.close()
})



