import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Add.css";
const EditAd: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("");
  const [learningMode, setLearningMode] = useState("");
  const [frequency, setFrequency] = useState("");
  const [startDate, setStartDate] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/ads/${id}/`);
        if (response.ok) {
          const data = await response.json();
          setSubject(data.subject);
          setDescription(data.description);
          setLevel(data.level || "");
          setLearningMode(data.learning_mode);
          setFrequency(data.frequency || "");
          setStartDate(data.start_date || "");
          setLoading(false);
        } else {
          alert("Failed to load ad.");
          navigate("/account");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while fetching the ad.");
        navigate("/account");
      }
    };
    fetchAd();
  }, [id, navigate]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = sessionStorage.getItem("accessToken");
    const updatedAd = {
      subject,
      description,
      level,
      learning_mode: learningMode,
      frequency,
      start_date: startDate || null,
    };
    try {
      const response = await fetch(`http://localhost:8000/api/ads/${id}/update/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedAd),
      });
      if (response.ok) {
        alert("Ad updated successfully.");
        navigate("/account");
      } else {
        alert("Failed to update ad.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while updating the ad.");
    }
  };
  if (loading) {
    return <p>Loading ad details...</p>;
  }
  return (
    <div className="add-container">
      <h1 className="add-title">Edit Ad</h1>
      <form className="add-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Level</label>
          <input
            type="text"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Learning Mode</label>
          <input
            type="text"
            value={learningMode}
            onChange={(e) => setLearningMode(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Frequency</label>
          <input
            type="text"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="form-actions">
          <button
            type="button"
            className="category-button"
            onClick={() => navigate("/account")}
          >
            Cancel
          </button>
          <button type="submit" className="category-button">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
export default EditAd;