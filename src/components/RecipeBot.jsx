import React from 'react';
import ChatBot from 'react-simple-chatbot';
import FetchRecipes from './FetchRecipes';
import styles from './recipebot.module.css';

export default function RecipeBot({setFoodId,setToggle}) {
  const steps = [
    {
      id: '1',
      message: 'Hi! I can help you find recipes. What ingredients do you have?',
      trigger: '2',
    },
    {
      id: '2',
      user: true,
      trigger: '3',
    },
    {
      id: '3',
      component:<FetchRecipes setFoodId={setFoodId}/>,
      waitAction: true,
    },
    {
      id: "5",
      message: "Great choice! You selected: {previousValue}",
      trigger: "2",
    },
  ];

  return <div>
    <div>
      <button className={styles.setChatbot} onClick={()=>setToggle(false)}>Back to UI</button>
    </div>
    <ChatBot steps={steps} />
    </div>;
}
