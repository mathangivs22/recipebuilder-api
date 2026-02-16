import { useEffect, useState } from "react"
import styles from './foodDetail.module.css';
export default function FoodDetails({foodId,toggleComponent}){
    const URL =`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${foodId}`
    const [food,setFood] = useState({});
    const [isLoading,setIsLoading] = useState(true);
    useEffect((()=> {
        async function displayItemContent(){
           const response = await fetch(`${URL}`);
           const data = await response.json();
           console.log(data.meals[0]);
           setFood(data.meals[0])
           setIsLoading(false);
        }
        displayItemContent()}
    ),[foodId])
    return <div>
        <div className={styles.cardContainer}>
            <h1 className={styles.recipeName}>{food.strMeal}</h1>
            <img className={styles.recipeImage}  src={food.strMealThumb} alt="" width={200}/>
        <div>
            <span>
            <strong>Cusine Area :{food.strArea}</strong>
        </span><br/>
        </div>
        <div>
             <h2>Ingredients</h2>
            {Array.from({ length: 20 }, (_, i) => i + 1).map(i => {
                const ingredient = food[`strIngredient${i}`];
                const measure = food[`strMeasure${i}`];
                if (ingredient && ingredient.trim() !== '') {
                return (
                <div key={i}>
                {ingredient} : {measure}
                </div>
                );
    }
    return null;
  })}
            <h1>Instructions</h1>
            {isLoading?(<p>Loading...</p>):(
            <span className={styles.recipeInstructions}>
                <ol>
                   {food.strInstructions
                    ?.replace(/^\d+[\.\)]?\s*/gm, '')  
                    .split(/\r?\n/)
                    .filter(step => step.trim() !== "")
                    .map((step, index) => (
                    <li key={index}>{step}</li>
                    ))}
                </ol>
            </span>)}
        </div>
         </div>
        </div>
}