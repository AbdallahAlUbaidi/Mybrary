if(process.env.NODE_ENV !== "production")
{
    require('dotenv').config()
}
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const app = express()

//Importing Routers Modules
const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')


app.set('view engine' , 'ejs')
app.set('views' , __dirname + '/views')
app.set('layout' , 'layouts/layout')
app.use(bodyParser.urlencoded({limit:"10mb" , extended:false}))
app.use(express.static('public'));
app.use(expressLayouts)



mongoose.connect(process.env.DATABASE_URL , 
    ()=> { console.log("connected successfully") } ,
    (e)=>{ console.error(e);})

//Using Routers
app.use('/' , indexRouter)
app.use('/authors' , authorRouter)
app.use('/books' , bookRouter)




app.listen(process.env.PORT || 80);