import React, { useState } from "react";
import "./home.css";
import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu"; // Corrected case
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay"; // Corrected case
import AppDownLoad from "../../components/AppDownLoad/AppDownLoad";

const Home = () => {
  const [category, setCategory] = useState("ALL");
  return (
    <div>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
      <AppDownLoad />
    </div>
  );
};

export default Home;
