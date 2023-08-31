import axios from "axios";
import { useEffect, useState } from "react"
import { useParams,useNavigate } from "react-router-dom";
import style from "./MainPage.module.css"

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
            if(selectedMonth===""||profitOrLoss===""||assets===""||year==="")alert("Please Fill All Details!!");
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
            <div className={style.popup}>
                 <div>
                     <label htmlFor="monthSelect">Select a Month: </label>
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
                     <label>Profit or Loss: </label>
                     <input type="number" value={profitOrLoss} onChange={(e)=>setProfitOrLoss(e.target.value)}/>
                 </div>
                 <div>
                     <label>Assets Value: </label>
                     <input type="number" value={assets} onChange={(e)=>setAssets(e.target.value)}/>
                 </div>
                 <button className={style.addButton} onClick={()=>handleAdd()}>Add</button>
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
            if(name===""||loanAmount===""||provider===""||monthlyInfos.length===0){
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
            //console.log(`error occurred while submitting details`,error);
            if(error.response)alert(`${error.response.data}, Please Try Again!!`)
            else alert(`${error.message}, Please Try Again!!`)
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
            if(error.response)alert(`${error.response.data}, Please Try Again!!`)
            else alert(`${error.message}, Please Try Again!!`)
        }
    }
    return (
     <div className={style.mainBody}>
        <h1>Please Fill the require details!!</h1>
         <div>
             <label htmlFor="name">Name: </label>
             <input className={style.normalInput} id="name" value={name} type="text" onChange={(e)=>setName(e.target.value)}/>
         </div>
         <div>
             <label htmlFor="year">Year: </label>
             <input className={style.normalInput} id="year" value={year} type="number" onChange={(e)=>setYear(e.target.value)}/>
         </div>
         <div>
             <label htmlFor="year">Loan Amount: </label>
             <input className={style.normalInput} id="year" value={loanAmount} type="number" onChange={(e)=>setLoanAmount(e.target.value)}/>
         </div>
         <div>
                     <label htmlFor="providerSelect">Select a Accounting Provider: </label>
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
             <div className={style.financeDetails}>
                <div>Add Monthly Financial Details</div>
                <button className={style.openbutton} onClick={()=>setOpenPopup((prevValue)=>!prevValue)}>+</button>
             </div>
             <Popup/>
         </div>
         <div className={style.tableContainer}>
            <div className={`${style.tableRow} ${style.header}`}>
                <div className={style.tableCell}>Year</div>
                <div className={style.tableCell}>Month</div>
                <div className={style.tableCell}>Profit/Loss</div>
                <div className={style.tableCell}>Assets</div>
                <div className={style.tableCell}></div> {/* Empty cell for delete buttons */}
            </div>
            {monthlyInfos.map((info, index) => {
                return (
                <div className={style.tableRow} key={index}>
                    <div className={style.tableCell}>{info.year}</div>
                    <div className={style.tableCell}>{months[info.month]}</div>
                    <div className={style.tableCell}>{info.profitOrLoss}</div>
                    <div className={style.tableCell}>{info.assets}</div>
                    <div className={style.tableCell}>
                    <button onClick={() => removeInfo(index)}>Delete</button>
                    </div>
                </div>
                );
            })}
         </div>
         <div className={style.navigation}>
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
            //console.log(`error occurred while submitting the application`,error);
            if(error.response)alert(`${error.response.data}, Please Try Again!!`)
            else alert(`${error.message}, Please Try Again!!`)
        }
    }
    return (
        <div className={style.mainBody}>
            <h1>
                Please Review the Generated Balance Sheet
            </h1>
            <div>
                Business Name: {businessName}
            </div>
            <div>
                Loan Amount: {businessLoanAmount}
            </div>
            <div className={style.tableContainer}>
            <div className={`${style.tableRow} ${style.header}`}>
                <div className={style.tableCell}>Year</div>
                <div className={style.tableCell}>Month</div>
                <div className={style.tableCell}>Profit/Loss</div>
                <div className={style.tableCell}>Assets</div>
            </div>
                {balanceSheet.map((info, index) => {
                    return (
                    <div className={style.tableRow} key={index}>
                        <div className={style.tableCell}>{info.year}</div>
                        <div className={style.tableCell}>{months[info.month]}</div>
                        <div className={style.tableCell}>{info.profitOrLoss}</div>
                        <div className={style.tableCell}>{info.assets}</div>
                    </div>
                    );
                })}
            </div>
            <div className={style.navigation}>
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
            //console.log('error occurred while checking validity of uid',error);
            navigate(`/`)
        }
    }   
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