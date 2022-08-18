const mongoose = require("mongoose")
authorSchema = mongoose.Schema({
    name:{type:String , required:true}
})


module.exports = mongoose.model('Author' , authorSchema);