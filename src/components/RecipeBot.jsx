import { useState } from "react";
import styles from "./recipebot.module.css";

const API = "https://recipebuilder-api.onrender.com";

export default function RecipeBot({ setFoodId, setToggle }) {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I can help you find recipes. What ingredients do you have?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("ingredients"); // ingredients | question
  const [selectedRecipe, setSelectedRecipe] = useState("");

  const addMessage = (from, text) => {
    setMessages(prev => [...prev, { from, text }]);
  };

  const addRecipes = (recipes) => {
    setMessages(prev => [...prev, { from: "bot", type: "recipes", recipes }]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userInput = input.trim();
    setInput("");
    addMessage("user", userInput);
    setLoading(true);

    if (stage === "ingredients") {
      // Call /recipes endpoint
      try {
        const res = await fetch(`${API}/recipes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: userInput }),
        });
        const data = await res.json();
        if (data.recipes && data.recipes.length > 0) {
          addRecipes(data.recipes);
        } else {
          addMessage("bot", "No recipes found 😢 Try different ingredients!");
        }
      } catch (err) {
        addMessage("bot", "Something went wrong. Please try again.");
      }

    } else if (stage === "question") {
      // Call /chat endpoint
      try {
        const res = await fetch(`${API}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `The user selected the recipe: ${selectedRecipe}. Their question is: ${userInput}`,
            history: []
          }),
        });
        const data = await res.json();
        addMessage("bot", data.reply);
        addMessage("bot", "Ask another question or type new ingredients to search again!");
      } catch (err) {
        addMessage("bot", "Sorry, couldn't get a response right now.");
      }
    }

    setLoading(false);
  };

  const handleRecipeClick = (meal) => {
    setFoodId(meal.idMeal);
    setSelectedRecipe(meal.name);
    setStage("question");
    addMessage("user", meal.name);
    addMessage("bot", `Great choice! You selected ${meal.name}. Do you have any questions about this recipe?`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const handleNewSearch = () => {
    setStage("ingredients");
    setSelectedRecipe("");
    addMessage("bot", "What ingredients do you have?");
  };

  return (
    <div className={styles.container}>
      <button className={styles.setChatbot} onClick={() => setToggle(false)}>
        Back to UI
      </button>

      <div className={styles.chatBox}>
        {messages.map((msg, i) => (
          <div key={i}>
            {msg.type === "recipes" ? (
              <div className={styles.recipesContainer}>
                <p className={styles.botMessage}>Pick a recipe:</p>
                {msg.recipes.map(meal => (
                  <button
                    key={meal.idMeal}
                    className={styles.recipeButton}
                    onClick={() => handleRecipeClick(meal)}
                  >
                    {meal.name}
                  </button>
                ))}
              </div>
            ) : (
              <div className={msg.from === "user" ? styles.userMessage : styles.botMessage}>
                {msg.text}
              </div>
            )}
          </div>
        ))}

        {loading && <div className={styles.botMessage}>Thinking... 🤔</div>}
      </div>

      <div className={styles.inputRow}>
        <input
          className={styles.input}
          type="text"
          placeholder={stage === "ingredients" ? "Type ingredients..." : "Ask a question..."}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className={styles.sendButton} onClick={handleSend} disabled={loading}>
          Send
        </button>
        {stage === "question" && (
          <button className={styles.newSearch} onClick={handleNewSearch}>
            New Search
          </button>
        )}
      </div>
    </div>
  );
}