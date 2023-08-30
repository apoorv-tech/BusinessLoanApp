const express = require('express')
const app = express()
const port = 4000


app.get('/',async(req,res)=>{
    console.log("Welcome to the App!!");
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})