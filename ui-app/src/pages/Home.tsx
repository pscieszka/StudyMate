import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const categories = [
    "Mathematics",
    "Physics",
    "Computer Science",
    "English",
    "History",
    "Biology",
    "Chemistry",
    "Geography",
    "Civic Education",
  ];

const handleSearch = async () => {
  try {
    const response = await fetch(`http://localhost:8000/api/search/${encodeURIComponent(searchQuery)}/`);
    if (response.ok) {
      const data = await response.json();
      console.log("Search results:", data);
      navigate(`/search/${encodeURIComponent(searchQuery)}`); 
    } else {
      alert("An error occurred during the search.");
    }
  } catch (error) {
    console.error("Connection erro:", error);
    alert("Failed to connect to the server.");
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
