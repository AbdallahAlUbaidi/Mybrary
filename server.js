if(process.eventNames.NODE_ENV !== "production")
{
    require('dotenv').config()
}
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const mongoose = require("mongoose")
const app = express()

const indexRouter = require('./routes/index')


app.set('view engine' , 'ejs')
app.set('views' , __dirname + '/views')
app.set('layout' , 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'));


mongoose.connect(process.env.DATABASE_URL , 
    ()=> { console.log("connected successfully") } ,
    (e)=>{ console.error(e);})


app.use('/' , indexRouter)





app.listen(process.env.PORT || 80);