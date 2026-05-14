// model for user
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: {
    type: String,

  },
  email: {
    type: String,
  },
  password: {
    type: String,   

  },
  isAdmin: {
    type: Boolean,
  },
}, {timestamps:true});
module.exports = mongoose.model('User', userSchema);