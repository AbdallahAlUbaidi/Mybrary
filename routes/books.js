const express = require("express")
const multer = require('multer')
const path = require('path')
const fileSystem = require('fs')
const Book = require('../models/book.js')
const Author = require("../models/author")
const router = express.Router()


const uploadPath = path.join('public' , Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg' , 'image/png' , 'images/gif' ,  'image/bmp' ]
const upload = multer({
    dest:uploadPath,
    fileFilter: (req , file , callback)=>
    {
        callback(null ,imageMimeTypes.includes(file.mimetype) )
    }
})


//All Books Route
router.get('/' , async ( req , res )=>
{   
    let query = Book.find()
    if(req.query.title != null && req.query.title != '')
    {
        query = query.regex('title' , new RegExp(req.query.title , 'i'))
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore != '')
    {
        query = query.lte('publishDate' , req.query.publishedBefore)
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter != '')
    {
        query = query.gte('publishDate' , req.query.publishedAfter)
    }
    const searchOptions = req.query
    try{
        const books = await query.exec()
        res.render('books/index' , {books: books,
                searchOptions:searchOptions})
    }
    catch(error)
    {
        console.error(error)
        res.redirect('/')
    }

})

//Create Book form
router.get('/new' , async (req,res)=>
{
    renderNewPage(res , new Book());
})

//Create book
router.post('/' , upload.single('cover'), async (req,res)=>
{
    const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
        title:req.body.title,
        author:req.body.author,
        description:req.body.description,
        publishDate:new Date(req.body.publishDate),
        pageCount:req.body.pageCount,
        coverImageName:fileName
    })
    try
    {
        const newBook = await book.save()
        res.status(200).redirect("/books")
        // res.status(200).redirect(`/books/${newBook.id}`)
    }
    catch(error)
    {
        console.log(error);
        if(fileName != null)
            removeBookCover(fileName)
        renderNewPage(res , book , true)
    }
})

function removeBookCover(fileName)
{
    const bookCoverPath = path.join(uploadPath , fileName) 
    console.log(`Deleting ${bookCoverPath}`)
    fileSystem.unlink(bookCoverPath , error=>
    {
        if(error)
        {
            console.LOG(`an Error Occured: ${error}`)
        }
    })
}

async function renderNewPage(res , book , hasError = false)
{
    try{
        const authors = await Author.find({});
        const params = {authors:authors , book:book}
        if(hasError){params.errorMessage = 'Error Creating Book'}
        res.render('books/new' , params)
    }
    catch(error){
        console.log(error)
    }
}

module.exports = router