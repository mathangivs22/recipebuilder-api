import styles from "./fooditem.module.css"

export default function FoodItem({food,setFoodId}){
    return <div className={styles.container}>
        <img  className={styles.itemImage}  src={food.strMealThumb} alt =""/>
        <div className={styles.itemContent}>
            <p className={styles.itemTitle}>{food.strMeal}</p>
        </div>
        
        <div className={styles.buttonContainer}>
            <button onClick={()=>{
                console.log(food.idMeal)
                setFoodId(food.idMeal)}} className={styles.itemButton}>View Recipe</button>
        </div>
    </div>
}