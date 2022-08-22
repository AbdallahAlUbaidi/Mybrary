const express = require("express")
const Book = require('../models/book.js')
const Author = require("../models/author")
const router = express.Router()
const imageMimeTypes = ['image/jpeg' , 'image/png' , 'images/gif' ,  'image/bmp' ]


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

//Edit Book form
router.get('/:id/edit' , async (req,res)=>
{

    try{
        const book = await Book.findById(req.params.id)
        renderEditPage(res , book);
    }

    catch(error)
    {
        console.log(error)
        res.redirect('/')
    }
})


//Create book
router.post('/' , async (req,res)=>
{
    const book = new Book({
        title:req.body.title,
        author:req.body.author,
        description:req.body.description,
        publishDate:new Date(req.body.publishDate),
        pageCount:req.body.pageCount,
    })
    
    try
    {
        saveCover(book , req.body.cover)
        const newBook = await book.save()
        res.status(200).redirect(`/books/${newBook.id}`)
    }
    catch(error)
    {
        console.log(error);
        renderNewPage(res , book , true)
    }
})

//Show Book Route
router.get('/:id' , async (req , res)=>
{
    try {
        const book = await Book.findById(req.params.id)
                               .populate('author')
                               .exec();
        res.render('books/show' , {book:book} )
    }
    catch(error)
    {
        console.log(error)
        res.redirect('/');
    }
})


//Update book
router.put('/:id' , async (req,res)=>
{
    let book
    try
    {
        const book = await Book.findById(req.params.id)
        book.title = req.body.title
        book.author = req.body.author
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount = req.body.pageCount
        book.description = req.body.description
        if(req.body.cover != null && req.body.cover !== '')
        {
            saveCover(book , req.body.cover)
        }
        await book.save()
        res.status(200).redirect(`/books/${book.id}`)
    }
    catch(error)
    {
        console.log(error);
        if(book != null)
        {
            renderEditPage(res , book , true)
        } else{
            res.redirect('/')
        }
    }
})
//Delete Route
router.delete('/:id' , async (req , res)=>
{
    let book
    try
    {
        book = await Book.findById(req.params.id)
        await book.remove()
        res.redirect('/books')
    }
    catch(error)
    {
        console.log(error)
        if(book != null)
        {
            res.render('books/show' , {book:book , errorMessage:"Couldnt Delete the Book"})
        }
        else{
            res.redirect('/')
        }
    }
})
async function renderNewPage(res , book , hasError = false)
{
    renderFormPage(res, book, 'new' , hasError)
}

async function renderEditPage(res , book , hasError = false)
{
    renderFormPage(res , book , 'edit' , hasError);
}

async function renderFormPage(res , book , form , hasError = false)
{
    try{
        const authors = await Author.find({});
        const params = {authors:authors , book:book}
        if(hasError){
            if(form === 'edit')
                {
                    params.errorMessage = 'Error Updating The Book'
                }
            else
            {
                params.errorMessage = 'Error Creating Book'
            }
        }
        res.render(`books/${form}` , params)
    }
    catch(error){
        console.log(error)
        res.redirect('/')
    }
}

function saveCover(book , coverEncoded)
{
    
    if(coverEncoded == null) return
    const cover = JSON.parse(coverEncoded);
    if(cover != null &&  imageMimeTypes.includes(cover.type))
    {
       
        book.coverImage = Buffer.from(cover.data , 'base64')
        book.coverImageType = cover.type;
    } 
}

module.exports = router