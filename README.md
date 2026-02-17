# 🍽️ Recipe Builder App

Recipe Builder is a full-stack web application that helps users discover recipes easily through both a **search-based UI** and an **interactive chatbot experience**.

The app allows users to explore recipes, filter them based on ingredients, and view complete cooking instructions in a simple and user-friendly interface.

---

## Features

### Recipe Search Interface
- Users can search for recipes directly using a clean UI.
- Recipes are fetched dynamically from the backend API.

### 🤖 Chatbot-Based Recipe Finder (Powered by Groq + LLM)

- Users can switch to a chatbot mode for a more interactive recipe search experience.
- The chatbot prompts users to enter an ingredient (e.g., chicken, tomato, pasta).
- Using Groq-hosted LLaMA/OpenAI-style language model integration, the bot responds conversationally.
- Based on the ingredient provided, the app filters recipes from the API and displays the most relevant results.
- Users can click any recipe to view full details, including ingredients and cooking procedure.

### 📖 Detailed Recipe View
- When a user clicks on a recipe, the app shows:
  - Full recipe name
  - Ingredients list
  - Step-by-step cooking procedure

### 🌐 Live API Integration
- The frontend connects with a FastAPI backend deployed online.
- Recipe data is served through REST API endpoints.

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite
- **Backend:** FastAPI (Python)
- **Deployment:**
  - Frontend hosted on GitHub Pages
  - Backend deployed using Render

---

## 📌 How It Works

1. Users search for recipes using the UI  
2. Or they interact with the chatbot to find recipes based on ingredients  
3. Matching recipes are displayed  
4. Clicking a recipe opens full details including ingredients and procedure  

---
## 🔗 Live Links

- **Backend API:** https://recipebuilder-api.onrender.com/
- **Project Live**: https://mathangivs22.github.io/recipebuilder-api/index.html  

---
