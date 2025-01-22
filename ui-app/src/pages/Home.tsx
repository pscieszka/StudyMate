import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

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

const handleSearch = async () => {
  try {
    const response = await fetch(`http://localhost:8000/api/search/${encodeURIComponent(searchQuery)}/`);
    if (response.ok) {
      const data = await response.json();
      console.log("Wyniki wyszukiwania:", data);
      navigate(`/search/${encodeURIComponent(searchQuery)}`); 
    } else {
      alert("Wystąpił błąd podczas wyszukiwania.");
    }
  } catch (error) {
    console.error("Błąd połączenia:", error);
    alert("Nie udało się połączyć z serwerem.");
  }
};


  const handleCategoryClick = (category: string) => {
    navigate(`/ads/${encodeURIComponent(category)}`);
  };

  return (
    <div className="search-container">
      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search"
        />
        <button onClick={handleSearch}>Search</button>
      </div>

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
