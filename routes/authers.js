const express = require("express")
const Auther = require('../models/auther')
const router = express.Router();
//All Authers Route
router.get('/' , async ( req , res )=>
{   
    let searchOptions = {}
    try{
        if(req.query.name != null && req.query.name !== '')
            searchOptions.name = new RegExp(req.query.name , 'i')
        const authers = await Auther.find(searchOptions)
        res.render('authers/index' , {
            authers:authers ,
            searchOptions:req.query
        })
    }
    catch(error){
        console.log(error)
        res.redirect('/')
    }
})

//Create Auther form
router.get('/new' , (req,res)=>
{
    res.render('authers/new' , {auther:new Auther()})
})

//Create Auther
router.post('/' , async (req,res)=>
{
    const auther = new Auther({
        name:req.body.name                   
    })
    try{
        const newAuther = await auther.save()
        res.status(200).redirect("/authers")
        // res.status(200).redirect(`/authers/${newAuther.id}`)
    }
    catch(error)
    {
        console.log(error)
        res.status(500).render('authers/new' , {auther: auther , 
        errorMessage:"Could not create new Auther"})
    }
})

module.exports = router