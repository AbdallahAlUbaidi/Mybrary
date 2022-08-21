const mongoose = require("mongoose")
const Book = require('./book')
authorSchema = mongoose.Schema({
    name:{type:String , required:true}
})

authorSchema.pre('remove' , function(next)
{
    
    Book.find({author:this.id} , (error , books)=>
    {
        if(error)
        {
            next(error)
        }
        else if(books.length > 0 )
        {
            console.log(`${books.length} Books Exists for ${this.name}`)
            next(new Error("This Author Has books still"))
        }
        else
        {
            console.log(books.length)
            next()
        }
    })

}) 

module.exports = mongoose.model('Author' , authorSchema);
