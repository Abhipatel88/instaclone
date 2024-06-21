const mongoose =require('mongoose'); // require mongoose for use this db
const plm = require('passport-local-mongoose'); 
mongoose.connect("mongodb://127.0.0.1:27017/insta"); // mongoose connext to connect the db
const userSchema = mongoose.Schema({  /* it is use for createing a schema*/
  username:String,
  name:String,
  email:String,
  password:String,
  profileImage:String,
  posts:[{type:mongoose.Schema.Types.ObjectId, ref:"post"}],


});
userSchema.plugin(plm) //aa use thay for deseriallize user and seriallized user which we use in app.js file
module.exports=mongoose.model("user",userSchema) // use for make user model so wwe can use for CRUD operations
