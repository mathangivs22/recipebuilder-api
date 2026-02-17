from fastapi import FastAPI
from pydantic import BaseModel
import requests
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
import os
groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
class ChatInput(BaseModel):
    message: str
    history: list = []  # to maintain conversation context

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

@app.post("/chat")
def chat(input: ChatInput):
    # Build messages array with history for context
    messages = [
        {
            "role": "system",
            "content": """You are a friendly recipe and cooking assistant. 
            You help users with:
            - Recipe suggestions based on ingredients they have
            - Cooking tips and techniques
            - Ingredient substitutions
            - Meal planning
            Keep responses concise, friendly and helpful.
            If asked about non-food topics, politely redirect to cooking."""
        }
    ]
    
    # Add conversation history for context
    for msg in input.history:
        messages.append(msg)
    
    # Add current user message
    messages.append({"role": "user", "content": input.message})
    
    try:
        response = groq_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=messages,
            max_tokens=500
        )
        reply = response.choices[0].message.content
        return {"reply": reply}
    except Exception as e:
        print("Groq error:", e)
        return {"reply": "Sorry, I am having trouble responding right now. Please try again."}