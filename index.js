require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./routes/router')
require('./config/connection')

const orderSever = express()

orderSever.use(cors())
orderSever.use(express.json())
orderSever.use(router)

const PORT = 3000

orderSever.listen(PORT,()=>{
    console.log(`Server is running at ${PORT} and waiting for client request`);
})

orderSever.get('/',(req,res)=>{
    res.status(200).send(`<h1>Project Fair server started at port and waiting for client request</h1>`)
})