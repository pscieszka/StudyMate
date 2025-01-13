import React, {useState} from "react";
import "./Home.css";
import {useNavigate} from "react-router-dom";

const Home: React.FC = () => {
   const [searchQuery, setSearchQuery] = useState("");
   const navigate = useNavigate();

     const categories = [
    "Matematyka",
    "Fizyka",
    "Informatyka",
    "Język polski",
    "Historia",
    "Biologia",
    "Chemia",
    "Geografia",
    "WOS",
  ];

   const handleSearch = () => {
    console.log("Szukaj:", searchQuery);
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/ads/${encodeURIComponent(category)}`);
  };

 return (
    <div className="search-container">
      {/* Pasek wyszukiwania */}
      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search"
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Lista kategorii jako przyciski */}
      <div className="categories">
        {categories.map((category, index) => (
          <button
            key={index}
            className="category-button"
            onClick={() => handleCategoryClick(category)}
          >
              {category}
          </button>
        ))}
      </div>
    </div>
  );
};


export default Home;
