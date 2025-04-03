const mongoose = require('mongoose')


const connection_string = process.env.CONNECTION_STRING

mongoose.connect(connection_string).then((res)=>{
    console.log("MongoDB Atlas connected with order server");
    
}).catch(err=>{
    console.log("Connection Failed");
    console.log(err);
})