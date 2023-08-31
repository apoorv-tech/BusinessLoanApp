const express = require('express')
const app = express()
const uuid = require('uuid');
const cors = require('cors')
const port = 4000

//middlewares used
app.use(cors())
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));

//using uniqueids to keep track of applications
const uniqueIds = {}

//this is just a simulation of accounting software 
const generate_balance_sheet = (monthlyStatements,provider)=>{
    //using provider we can shoose accounting software as per requirement but for now just running a simulation
    return monthlyStatements.sort((a,b)=>b.month-a.month)
}

//this is a simulation of decision engine
const decision_engine = (output)=>{
    //here lies the logic for decision engine for now if preAssessment value is greater than 20 then we are approving the loan
    return output.preAssessment>20
}

//api to start the loan application
app.get('/api/start',async(req,res)=>{
    try {
        let uniqueID = uuid.v4();
        while(uniqueIds[uniqueID]){
            uniqueID = uuid.v4()
        }
        uniqueIds[uniqueID] = true
        console.log(uniqueIds);
        console.log(`generated unique id: ${uniqueID}`)
        res.status(200).send(uniqueID)
    } catch (error) {
        console.log("error occurred while initializing loan application",error);
        res.status(500).send("Internal Server Error")
    }
})

//api to cancel the loan application
app.post('/api/cancel',async(req,res)=>{
    try {
        const uid = req.body.uid
        if(uid===null||uid===undefined||!uniqueIds[uid])return res.status(400).send("Invalid uid")
        delete uniqueIds[uid]
        res.status(200).send('Loan Application is Cancelled')
    } catch (error) {
        console.log("error occurred while cancelling the loan application",error);
        res.status(500).send("Internal Server Error")
    }
})

//api to check the validty of loan application uid
app.get('/api/isvalid/:uid',async(req,res)=>{
    try {
       const uid = req.params.uid
       if(uid===null||uid===undefined||!uniqueIds[uid])return res.status(400).send("Invalid uid")
       res.status(200).send("Uid is valid") 
    } catch (error) {
        console.log("error occurred while validating loan application",error);
        res.status(500).send("Internal Server Error")
    }
})

//api to fetch the balance sheet for the loan application
app.post('/api/fetch_balance_sheet',async(req,res)=>{
    try {
        const name = req.body.name
        const monthlyInfos = req.body.monthlyInfos
        const provider = req.body.provider
        if(name===undefined||name===""||name===null)return res.status(400).send("Please Send a valid name")
        if(monthlyInfos===undefined||monthlyInfos===""||monthlyInfos===null||monthlyInfos.length==0)return res.status(400).send("Please Send a valid monthlyInfo")
        if(provider===undefined||provider===""||provider===null)return res.status(400).send("Please Send a valid accounting provider")

        //now generate the balance sheet from the accounting software
        generate_balance_sheet(monthlyInfos,provider)

        res.status(200).send({name: name,balanceSheet: monthlyInfos})

    } catch (error) {
        console.log("error occurre while fetching balance sheet",error);
        res.status(500).send("Internal Server Error")
    }
})

//api to submit the final application to decision engine and generate the outcome
app.post('/api/submitApplication',async(req,res)=>{
    try {
        const name = req.body.name
        const balanceSheet = req.body.balanceSheet
        const loanAmount = req.body.loanAmount
        if(name===undefined||name===""||name===null)return res.status(400).send("Please Send a valid name")
        if(balanceSheet===undefined||balanceSheet===""||balanceSheet===null||balanceSheet.length==0)return res.status(400).send("Please Send a valid Balance Sheet")
        if(loanAmount===undefined||loanAmount===""||loanAmount===null)return res.status(400).send("Please Send a valid Loan Amount")

        let totalProfitorLoss = 0,totalAssets=0,preAssessment=20
        for(const info of balanceSheet){
            totalProfitorLoss+=parseInt(info.profitOrLoss)
            totalAssets+=parseInt(info.assets)
        }
        if(totalProfitorLoss>0){
            if(totalAssets>=loanAmount)preAssessment=100
            else preAssessment=60
        }
        const output = {
            name: name,
            year: balanceSheet[0].year,
            profitOrLoss: totalProfitorLoss,
            preAssessment: preAssessment
        }
        console.log(output);
        //now submit this output to decision engine
        if(decision_engine(output))return res.status(200).send('Your Loan has been approved')
        else res.status(200).send('Your Loan is not approved')
    } catch (error) {
        console.log(`error occurred while submitting the application`,error);
        res.status(500).send('Internal Server Error')
    }
})


//server listening on port 4000
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})