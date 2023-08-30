import { useEffect, useState } from "react"

const Details = ()=>{
    const [monthlyInfos,setMonthlyInfos]=useState([])
    const months = [
     'January', 'February', 'March', 'April', 'May', 'June',
     'July', 'August', 'September', 'October', 'November', 'December'
    ]
    const [openPopup,setOpenPopup]=useState(false)
    const Popup = ()=>{
        const [selectedMonth, setSelectedMonth] = useState("");
        const [profitOrLoss,setProfitOrLoss] = useState("")
        const [assets,setAssets] = useState("")
        const handleAdd = ()=>{
            console.log("Monthly Statement: ");
            console.log(`month: ${selectedMonth}`);
            console.log(`profit or loss: ${profitOrLoss}`);
            console.log(`assets: ${assets}`);
            if(selectedMonth===""||profitOrLoss===""||assets==="")console.log("Please Fill All Details!!");
            else{
                // Check if the selected month already exists in monthlyInfos
                const monthExists = monthlyInfos.some(item => item.month === selectedMonth);
                if (monthExists) {
                    console.log("This month's details already exist!");
                } else {
                    setMonthlyInfos(prevArr => ([...prevArr, { month: selectedMonth, profitOrLoss: profitOrLoss, assets: assets }]));
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
                         <option key={index} value={month}>
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
    return (
     <div>
         <div>
             <label htmlFor="name">Name</label>
             <input id="name" type="text" required/>
         </div>
         <div>
             <label htmlFor="year">Year</label>
             <input id="year" type="number"/>
         </div>
         <div>
             <label htmlFor="year">Loan Amount</label>
             <input id="year" type="number"/>
         </div>
         <div>
             <div>Click to add Financial Statement of a month of the provided year</div>
             <button onClick={()=>setOpenPopup((prevValue)=>!prevValue)}>+</button>
             <Popup/>
         </div>
             {monthlyInfos.map((info,index)=>{
                 return (
                     <div key={index}>
                        <div>{info.month},{info.profitOrLoss},{info.assets}</div>
                        <button onClick={()=>removeInfo(index)}>Delete</button>
                     </div>
                 )
             })}
     </div>
    ) 
}

const MainPage = ()=>{
    return (
        <div>
            <div>Please Fill the require details!!</div>
            <Details/>
        </div>
    )
}

export default MainPage