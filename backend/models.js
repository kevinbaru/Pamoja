var mongoose = require('mongoose');
mongoose.Promise=global.Promise;
var connect = process.env.MONGODB_URI;

var userSchema = mongoose.Schema({

  name:{
    type:String,
    required:true
  },
  email: String,
  password:{
    type:String,
    required:true,
  },
  documents:[{
    type:mongoose.Schema.ObjectId,
    ref:'Document'
  }]


});

var documentSchema = mongoose.Schema({
users:[{
  type:mongoose.Schema.ObjectId,
  ref:'User'
}],
date:Date,
title:String,
content:String,
history:[],

});



User = mongoose.model('User', userSchema);

Document = mongoose.model('Document', documentSchema);

module.exports = {
    User:User,
    Document:Document,
};
