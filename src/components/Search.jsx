import { useEffect, useState } from "react"
import styles from './search.module.css';

const URL = "https://www.themealdb.com/api/json/v1/1/search.php"
//Hooks in the component not outside
//UseEffect hook to sync our component with external system. Real time data rendering.

export default function Search({foodData,setFoodData,toggleComponent,setToggle}){

    const[input,setInput] = new useState("pizza");
    //Syntax of useeffect hook
    //dependency array when we change the input this function will be executed

    useEffect(()=>{
    async function fetchFood(){
        const response = await fetch(`${URL}?s=${input}`)
        const foodData = await response.json();
        setFoodData(foodData.meals);
    }

    fetchFood()
    },[input])
    return <div>
        <div>
            <button className={styles.setChatbot} onClick={()=>setToggle(true)}>Switch to Chatbot</button>
        </div>
        <div className={styles.searchContainer}>
        <input className={styles.input} onChange={(e)=>setInput(e.target.value)} type="text" value={input}/>
    </div>
    </div>
}