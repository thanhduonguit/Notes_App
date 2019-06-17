const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/notes_app', {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false
})
  .then(db => console.log('MongoDB Connected!'))
  .catch(err => console.error(err))