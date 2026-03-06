import React, { useContext } from "react";
import { StoreContext } from  "../../Contex/StoreContext";  // Corrected path
import "./FoodDisplay.css";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {food_list.map((item, index) => {
          // Proper conditional rendering within the map function
          if (category === "ALL" || category === item.category) {
            return (
              <FoodItem
                key={index}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            );
          } else {
            return null; // Return null if the category doesn't match
          }
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
