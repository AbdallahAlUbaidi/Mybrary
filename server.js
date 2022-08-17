if(process.env.NODE_ENV !== "production")
{
    require('dotenv').config()
}
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const app = express()

const indexRouter = require('./routes/index')
const autherRouter = require('./routes/authers')


app.set('view engine' , 'ejs')
app.set('views' , __dirname + '/views')
app.set('layout' , 'layouts/layout')
app.use(bodyParser.urlencoded({limit:"10mb" , extended:false}))
app.use(express.static('public'));
app.use(expressLayouts)



mongoose.connect(process.env.DATABASE_URL , 
    ()=> { console.log("connected successfully") } ,
    (e)=>{ console.error(e);})


app.use('/' , indexRouter)
app.use('/authers' , autherRouter)




app.listen(process.env.PORT || 80);