const express = require("express")
const Author = require('../models/author')
const router = express.Router();
//All Authors Route
router.get('/' , async ( req , res )=>
{   
    let searchOptions = {}
    try{
        if(req.query.name != null && req.query.name !== '')
            searchOptions.name = new RegExp(req.query.name , 'i')
        const authors = await Author.find(searchOptions)
        res.render('authors/index' , {
            authors:authors ,
            searchOptions:req.query
        })
    }
    catch(error){
        console.log(error)
        res.redirect('/')
    }
})

//Create Author form
router.get('/new' , (req,res)=>
{
    res.render('authors/new' , {author:new Author()})
})

//Create Author
router.post('/' , async (req,res)=>
{
    const author = new Author({
        name:req.body.name                   
    })
    try{
        const newAuthor = await author.save()
        res.status(200).redirect("/authors")
        // res.status(200).redirect(`/authors/${newAuthor.id}`)
    }
    catch(error)
    {
        console.log(error)
        res.status(500).render('authors/new' , {author: author , 
        errorMessage:"Could not create new Author"})
    }
})

module.exports = router