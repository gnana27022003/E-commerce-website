const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')

app.use(session({
    secret: 'e-commerce',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


require('dotenv').config();



console.log('MONGO_URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));


app.use(express.static(path.join(__dirname,'views')))
app.use(express.static(path.join(__dirname,'css')))
app.use(express.static(path.join(__dirname,'images')))
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname,'views/dashboard')))


const uroute = require('./router/uroute')
const broute = require('./router/broute')
const sroute = require('./router/sroute')
const oroute = require('./router/oroute')

app.use(broute)
app.use(sroute)
app.use(oroute)
app.use(uroute)

app.listen(3008, ()=>{
    console.log("Server running at http://localhost:3008/")
})