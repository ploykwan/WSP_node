let mongoose = require('mongoose')

let articleSchema = mongoose.Schema({
  prize: {
    type: String,
    required: true
  },
  athlete: {
    type: String,
    required: true
  },
  describe: {
    type: String,
    required: true
  }
})
let Article = module.exports = mongoose.model('rewards', articleSchema);
