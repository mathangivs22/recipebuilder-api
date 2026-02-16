import { useState, useEffect } from 'react'
import Search from './components/Search'
import FoodList from './components/FoodList';
import Nav from './components/Nav';
import "./App.css";
import Container from './components/Container';
import InnerContainer from './components/InnerContainer';
import FoodDetails from './components/FoodDetails';
import RecipeBot from './components/RecipeBot';

function App() {
  const [foodData, setFoodData] = useState([]);
  const [foodId, setFoodId] = useState("53330");
  const [toggleComponent, setToggle] = useState(false);

  // Clear foodId when entering chatbot mode
  useEffect(() => {
    if (toggleComponent) {
      setFoodId(null);
    }
  }, [toggleComponent]);

  const handleBackToUI = () => {
    setFoodData([]);
    setFoodId("53330");
    setToggle(false);
  };

  return (
    <div>
      <Nav />
      
      {!toggleComponent && (
        <Search 
          foodData={foodData} 
          setFoodData={setFoodData} 
          toggleComponent={toggleComponent} 
          setToggle={setToggle}
        />
      )}

      <Container>
        <InnerContainer>
          {toggleComponent ? (
            <RecipeBot 
              setFoodId={setFoodId} 
              setToggle={handleBackToUI}  
            />
          ) : (
            <FoodList 
              foodData={foodData} 
              foodId={foodId} 
              setFoodId={setFoodId}
            />
          )}
        </InnerContainer>

        <InnerContainer>
          <FoodDetails foodId={foodId} toggleComponent={toggleComponent} />
        </InnerContainer>
      </Container>
    </div>
  )
}

export default App