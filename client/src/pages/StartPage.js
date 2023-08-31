import axios from "axios";

import { useNavigate } from "react-router-dom";
const StartPage = ()=>{
    const base_url =  process.env.REACT_APP_BASE_URL
    const navigate = useNavigate()
    const handleStart = async()=>{
        try {
            const response = await axios.get(`${base_url}/start`,{
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const uid = response.data
            console.log(uid)
            navigate(`/mainPage/${uid}`)
        } catch (error) {
            console.log(`error occurred while starting the loan application`,error);
        }
    }
    return (
        <div>
            <h1>Welcome to Business Loan App!! Click on Start to start your loan application</h1>
            <button onClick={()=>handleStart()}>Start</button>
        </div>
    )
}

export default StartPage