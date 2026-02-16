from fastapi import FastAPI
from pydantic import BaseModel
import requests
from fastapi.middleware.cors import CORSMiddleware
import re

app = FastAPI()

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserInput(BaseModel):
    text: str

# List of known ingredients for filtering
KNOWN_INGREDIENTS = [
    "chicken", "beef", "pork", "tomato", "garlic", "onion", "potato",
    "rice", "cheese", "butter", "carrot", "mushroom", "egg", "milk", "fish"
]

@app.post("/recipes")
def get_recipes(input: UserInput):
    text = input.text.lower()
    
    # Extract words from the sentence
    words = re.findall(r'\b\w+\b', text)
    ingredients = [word for word in words if word in KNOWN_INGREDIENTS]

    if not ingredients:
        return {"recipes": []}  # no known ingredients found

    try:
        results_per_ingredient = []

        for ingredient in ingredients:
            url = f"https://www.themealdb.com/api/json/v1/1/filter.php?i={ingredient}"
            res = requests.get(url, timeout=5)
            res.raise_for_status()
            meals = res.json().get("meals")
            if not meals:  # ingredient not found
                meals = []
            results_per_ingredient.append({meal["idMeal"]: meal for meal in meals})

        if not results_per_ingredient:
            return {"recipes": []}

        # Find meals that contain all ingredients
        common_ids = set(results_per_ingredient[0].keys())
        for result in results_per_ingredient[1:]:
            common_ids &= set(result.keys())

        if not common_ids:
            return {"recipes": []}

        # Fetch full meal details for instructions
        final_meals = []
        for meal_id in common_ids:
            try:
                detail_res = requests.get(f"https://www.themealdb.com/api/json/v1/1/lookup.php?i={meal_id}", timeout=5)
                detail_res.raise_for_status()
                detail_data = detail_res.json().get("meals")
                if not detail_data:
                    continue
                meal = detail_data[0]
                final_meals.append({
                    "idMeal": meal["idMeal"],
                    "name": meal["strMeal"],
                    "strInstructions": meal["strInstructions"],
                    "strMealThumb": meal["strMealThumb"]
                })
            except Exception as e:
                print(f"Error fetching meal details for {meal_id}: {e}")
                continue

        return {"recipes": final_meals[:10]}  # return top 10 meals

    except Exception as e:
        print("Error in /recipes endpoint:", e)
        return {"recipes": []}
