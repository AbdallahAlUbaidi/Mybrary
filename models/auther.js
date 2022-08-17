const mongoose = require("mongoose")
autherSchema = mongoose.Schema({
    name:{type:String , required:true}
})


module.exports = mongoose.model('Auther' , autherSchema);