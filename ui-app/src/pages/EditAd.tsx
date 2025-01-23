import React, { useEffect, useState } from "react";
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
        const response = await fetch(`http://localhost:8000/api/ads/id/${id}/`);
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
      const response = await fetch(`http://localhost:8000/api/ads/id/${id}/update/`, {
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
            <form className="add-form" onSubmit={handleSubmit}>
                <h1 className="add-title">Add Advertisement</h1>

                <div className="form-row">
                    <div className="form-group">
                        <label>Subject / Topic *</label>
                        <select
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        >
                            <option>Mathematics</option>
                            <option>Physics</option>
                            <option>Computer Science</option>
                            <option>English</option>
                            <option>History</option>
                            <option>Biology</option>
                            <option>Chemistry</option>
                            <option>Geography</option>
                            <option>Civic Education</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Level of Study *</label>
                        <select value={level}
                                onChange={(e) => setLevel(e.target.value)}
                                required
                        >
                            <option value="">Select level</option>
                            <option>High School</option>
                            <option>University</option>
                            <option>Primary School</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label>Advertisement Description *</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Write something"
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Learning Mode </label>
                        <select
                            value={learningMode}
                            onChange={(e) => setLearningMode(e.target.value)}
                        >
                            <option value="">Select mode</option>
                            <option>In-person meetings</option>
                            <option>Online</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Meeting Frequency </label>
                        <select
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                        >
                            <option value="">Select frequency</option>
                            <option>Once a week</option>
                            <option>Twice a week</option>
                            <option>Daily</option>
                            <option>Once a month</option>
                            <option>Every two weeks</option>
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label>Start Date </label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>

                <label>* - required </label>
                <div className="form-actions">
                    <button type="submit" className="submit-button">
                        Publish
                    </button>
                </div>
            </form>
        </div>
    );
};


export default EditAd;
