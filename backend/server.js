const express = require('express')
const app = express()
const uuid = require('uuid');
const port = 4000

const unique_applications = {}

app.get('/api/start',async(req,res)=>{
    try {
        let uniqueID = uuid.v4();
        while(unique_applications[uniqueID]){
            uniqueID = uuid.v4()
        }
        unique_applications[uniqueID] = true
        console.log(unique_applications);
        console.log(`generated unique id: ${uniqueID}`)
        res.status(200).send(uniqueID)
    } catch (error) {
        console.log("error occurred while initializing loan application",error);
        res.status(500).send("Internal Server Error")
    }
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})