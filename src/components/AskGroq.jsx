import { useEffect, useState } from "react";

export default function AskGroq({ steps, triggerNextStep }) {
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function askGroq() {
      const recipeName = steps["5"]?.value;
      const question = steps["6"]?.value;


      if (!question) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("https://recipebuilder-api.onrender.com/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
         message: `The user selected the recipe: ${recipeName}. Their question is: ${question}`, 
        history: [] 
        }),
        });
        const data = await res.json();
        setReply(data.reply);
      } catch (err) {
        setReply("Sorry, couldn't get a response right now.");
      } finally {
        setLoading(false);
      }
    }
    askGroq();
  }, []);

  if (loading) return <p>Thinking... 🤔</p>;

  return (
    <div>
      <p>{reply}</p>
      <button onClick={() => triggerNextStep({ value: reply, trigger: "2" })}>
        Search again
      </button>
    </div>
  );
}