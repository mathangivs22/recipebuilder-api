import React from 'react';
import ChatBot from 'react-simple-chatbot';
import FetchRecipes from './FetchRecipes';
import styles from './recipebot.module.css';
import AskGroq from './AskGroq';

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
      trigger: "6",
    },
    {
      id: "6",
      user: true,
      trigger: "7"
    },
    {
       id: "7",
      component: <AskGroq steps={steps} />,
      waitAction: true,
      asMessage: false,
    }
  ];

  return <div>
    <div>
      <button className={styles.setChatbot} onClick={()=>setToggle(false)}>Back to UI</button>
    </div>
    <ChatBot steps={steps} />
    </div>;
}
