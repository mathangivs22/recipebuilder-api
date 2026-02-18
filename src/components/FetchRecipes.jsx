import { useEffect, useState } from "react";

export default function FetchRecipes({ steps, triggerNextStep, setFoodId }) {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
  async function fetchFood() {
     if (hasFetched.current) return;  
        hasFetched.current = true;  

    const input = steps["2"]?.value;
    console.log("Fetching recipes for:", input);

    if (!input) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://recipebuilder-api.onrender.com/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      console.log("Raw response:", res);

      const data = await res.json();
      console.log("Data from backend:", data);

      setMeals(data.recipes || []);
    } catch (err) {
      console.log("Error fetching recipes:", err);
      setMeals([]);
    } finally {
      setLoading(false); 
    }

    setLoading(false);
  }
   if (meals.length === 0) {
    fetchFood();
  }
  
}, [steps]);
  // Loading state
  if (loading) {
    return <p>Finding recipes for you... 🍲</p>;
  }

  // No results case
  if (meals.length === 0) {
    return (
      <div>
        <p>No matching recipes found 😢</p>
        <button
          onClick={() => {
            console.log(meals);
            triggerNextStep({ value: "No recipe found", trigger: "5" })}}
        >
          Continue
        </button>
      </div>
    );
  }

  // Recipes found
  return (
    <div>
      <p>Pick a recipe:</p>

      {meals.map((meal) => (
        <button
          key={meal.idMeal}
          onClick={() => {
            // ✅ Update right-side recipe panel
            setFoodId(meal.idMeal);

            // ✅ Continue chatbot flow
            triggerNextStep({ value: meal.name, trigger: "5" });
          }}
        >
          {meal.name}
        </button>
      ))}
    </div>
  );
}
