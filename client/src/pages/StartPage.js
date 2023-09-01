import axios from "axios";

import { useNavigate } from "react-router-dom";
import style from './StartPage.module.css'
const StartPage = ()=>{
    const base_url =  'http://localhost:4000/api'
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
        <div className={style.mainBody}>
            <h1>Welcome to Business Loan App!! Click button &darr; below to start your loan application</h1>
            <button className={style.startButton} onClick={()=>handleStart()}>Start</button>
        </div>
    )
}

export default StartPage