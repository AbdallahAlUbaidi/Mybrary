const express = require("express")
const Book = require("../models/book")
const router = express.Router();


router.get('/' , async ( req , res )=>
{   
    let books = []
    try{
        books = await Book.find().sort({createdAt:-1}).limit(10).exec()
    }
    catch(error)
    {
        console.log(error)
    }

    res.render('index' , {books : books})
})

module.exports = router