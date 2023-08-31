import axios from "axios";
import { useEffect, useState } from "react"
import { useParams,useNavigate } from "react-router-dom";

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]

const Details = ({uid,setUID,base_url,setBalanceSheet,setBusinessName,setBusinessLoanAmount})=>{
    const [monthlyInfos,setMonthlyInfos]=useState([])
    const [name,setName] = useState("")
    const [year,setYear] = useState("")
    const [loanAmount,setLoanAmount] = useState("")
    const providers = ['Xero','MYOB']
    const [provider,setProvider] = useState("")
    const [openPopup,setOpenPopup]=useState(false)
    const Popup = ()=>{
        const [selectedMonth, setSelectedMonth] = useState("");
        const [profitOrLoss,setProfitOrLoss] = useState("")
        const [assets,setAssets] = useState("")
        const handleAdd = ()=>{
            console.log(`Name: ${name}`);
            console.log(`Year: ${year}`);
            console.log(`Loan Amount: ${loanAmount}`)
            console.log(`monthly statement: `);
            console.log(monthlyInfos);
            if(selectedMonth===""||profitOrLoss===""||assets===""||year==="")console.log("Please Fill All Details!!");
            else{
                // Check if the selected month already exists in monthlyInfos
                const monthExists = monthlyInfos.some(item => item.month === selectedMonth);
                if (monthExists) {
                    alert(`This month's details already exist!`)
                    console.log("This month's details already exist!");
                } else {
                    setMonthlyInfos(prevArr => ([...prevArr, { year: year,month: selectedMonth, profitOrLoss: profitOrLoss, assets: assets }]));
                    setOpenPopup(false);
                }
            }
        }
        if(!openPopup)return null
        return (
            <div>
                 <div>
                     <label htmlFor="monthSelect">Select a Month:</label>
                     <select id="monthSelect" value={selectedMonth} onChange={(e)=>setSelectedMonth(e.target.value)}>
                        <option value="">Please Select a month</option>
                         {months.map((month, index) => (
                         <option key={index} value={index}>
                             {month}
                         </option>
                         ))}
                     </select>
                 </div>
                 <div>
                     <label>Profit or Loss</label>
                     <input type="number" value={profitOrLoss} onChange={(e)=>setProfitOrLoss(e.target.value)}/>
                 </div>
                 <div>
                     <label>Assets Value</label>
                     <input type="number" value={assets} onChange={(e)=>setAssets(e.target.value)}/>
                 </div>
                 <button onClick={()=>handleAdd()}>Add</button>
            </div>
        )
    }
    const removeInfo = (index)=>{
        if(index>-1){
            setMonthlyInfos((prevArr)=> {
                const newArr = [...prevArr]
                newArr.splice(index,1)
                return newArr
            })
        }
    }
    const handleSubmit = async()=>{
        try {
            if(name===""||loanAmount===""||provider===""){
                alert('Please Fill all the details!!')
            }else{
                const response = await axios.post(`${base_url}/fetch_balance_sheet`,{
                    name: name,
                    monthlyInfos: monthlyInfos,
                    provider: provider
                },{
                    headers: {
                        'Content-Type':'application/json'
                    }
                })
                const data=response.data
                setBusinessName(data.name)
                setBusinessLoanAmount(loanAmount)
                setBalanceSheet(data.balanceSheet)
            }
        } catch (error) {
            console.log(`error occurred while submitting details`,error);
        }
    }
    const handleCancel = async()=>{
        try {
            console.log(uid);
            const response = await axios.post(`${base_url}/cancel`,{
                uid: uid
            })
            alert(response.data)
            setUID("")
        } catch (error) {
            console.log('error occurred while cancelling the loan application',error);
        }
    }
    return (
     <div>
        <div>Please Fill the require details!!</div>
         <div>
             <label htmlFor="name">Name</label>
             <input id="name" value={name} type="text" onChange={(e)=>setName(e.target.value)}/>
         </div>
         <div>
             <label htmlFor="year">Year</label>
             <input id="year" value={year} type="number" onChange={(e)=>setYear(e.target.value)}/>
         </div>
         <div>
             <label htmlFor="year">Loan Amount</label>
             <input id="year" value={loanAmount} type="number" onChange={(e)=>setLoanAmount(e.target.value)}/>
         </div>
         <div>
                     <label htmlFor="providerSelect">Select a Accounting Provider</label>
                     <select id="providerSelect" value={provider} onChange={(e)=>setProvider(e.target.value)}>
                        <option value=""></option>
                         {providers.map((provider, index) => (
                         <option key={index} value={provider}>
                             {provider}
                         </option>
                         ))}
                     </select>
         </div>
         <div>
             <div>Click to add Financial Statement of a month of the provided year</div>
             <button onClick={()=>setOpenPopup((prevValue)=>!prevValue)}>+</button>
             <Popup/>
         </div>
             {monthlyInfos.map((info,index)=>{
                 return (
                     <div key={index}>
                        <div>{info.year},{months[info.month]},{info.profitOrLoss},{info.assets}</div>
                        <button onClick={()=>removeInfo(index)}>Delete</button>
                     </div>
                 )
             })}
         <div>
            <button onClick={()=>handleSubmit()}>Submit</button>
            <button onClick={()=>handleCancel()}>Cancel</button>
         </div>
     </div>
    ) 
}

const BalanceSheet = ({base_url,balanceSheet,setBalanceSheet,businessName,businessLoanAmount})=>{
    const submitApplication = async()=>{
        try {
            const response =  await axios.post(`${base_url}/submitApplication`,{
                name: businessName,
                balanceSheet: balanceSheet,
                loanAmount: businessLoanAmount
            },{
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            alert(response.data)
        } catch (error) {
            console.log(`error occurred while submitting the application`,error);
        }
    }
    return (
        <div>
            Please Review the BalanceSheet
            <div>
                Business Name: {businessName}
            </div>
            <div>
                Loan Amount: {businessLoanAmount}
            </div>
            <div>
                {balanceSheet.map((info,index)=>{
                    return (
                        <div key={index}>
                            {info.year},{months[info.month]},{info.profitOrLoss},{info.assets}
                        </div>
                    )
                })}
            </div>
            <div>
                <button onClick={()=>submitApplication()}>Submit Application</button>
                <button onClick={()=>setBalanceSheet("")}>Cancel</button>
            </div>
        </div>
    )
}

const MainPage = ()=>{
    const {id} = useParams()
    const base_url =  process.env.REACT_APP_BASE_URL
    const [balanceSheet,setBalanceSheet] = useState("")
    const [businessName,setBusinessName] = useState("")
    const [businessLoanAmount,setBusinessLoanAmount] = useState("")
    const [uid,setUID] = useState(id)
    const navigate = useNavigate()
    useEffect(()=>{
        isValidUid()
    },[uid])
    const isValidUid = async()=>{
        try {
            const response = await axios.get(`${base_url}/isvalid/${uid}`,{
                headers: {
                    "Content-Type": "application/json"
                }
            })
            console.log(response.data);
        } catch (error) {
            console.log('error occurred while checking validity of uid',error);
            navigate(`/`)
        }
    }   
    console.log('component re rendering');
    return (
        <div>
            {balanceSheet===""?
            (<Details 
            uid = {id}
            setUID = {setUID}
            base_url={base_url}
            setBalanceSheet={setBalanceSheet}
            setBusinessName={setBusinessName}
            setBusinessLoanAmount={setBusinessLoanAmount}/>):
            (<BalanceSheet
            base_url={base_url} 
            balanceSheet={balanceSheet} 
            setBalanceSheet={setBalanceSheet}
            businessName={businessName}
            businessLoanAmount={businessLoanAmount}/>)}
        </div>
    )
}

export default MainPage