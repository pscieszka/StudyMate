import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Task {
  id: number;
  subject: string;
  description: string;
  level: string;
  learning_mode: string;
  frequency: string;
  start_date: string;
  assignedUsername: string | null;
}

const Account: React.FC = () => {
  const [myAds, setMyAds] = useState<Task[]>([]);
  const [assignedAds, setAssignedAds] = useState<Task[]>([]);
  const [error, setError] = useState<string>("");
  const [username, setUsername] = useState<string | null>(""); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAds = async () => {
      const savedUsername = localStorage.getItem("username");
      const token = sessionStorage.getItem("accessToken");
      setUsername(savedUsername);

      if (!savedUsername) {
        setError("You are not logged in or your session has expired.");
        return;
      }

      try {

        const userAdsResponse = await fetch(
          `http://localhost:8000/api/ads/${savedUsername}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (userAdsResponse.ok) {
          const userAdsData: Task[] = await userAdsResponse.json();
          setMyAds(userAdsData);
        } else {
          setError("Failed to fetch your ads. Please check your login status.");
        }

        const assignedAdsResponse = await fetch(
          `http://localhost:8000/api/ads/assigned/${savedUsername}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (assignedAdsResponse.ok) {
          const assignedAdsData: Task[] = await assignedAdsResponse.json();
          setAssignedAds(assignedAdsData);
        } else {
          setError(
            "Failed to fetch assigned ads. Please check your login status."
          );
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
      }
    };

    fetchAds();
  }, []);

  const handleDelete = async (taskId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/ads/id/${taskId}/delete/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.ok) {
        setMyAds((prevAds) => prevAds.filter((ad) => ad.id !== taskId));
      } else {
        alert("Failed to delete the ad.");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  const handleUnassign = async (taskId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/ads/deleteAssignment/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.ok) {
        alert("Unassigned successfully.");
        setAssignedAds((prevAds) => prevAds.filter((ad) => ad.id !== taskId));
      } else {
        alert("Failed to unassign the ad.");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  const handleEdit = (taskId: number) => {
    navigate(`/ads/id/${taskId}/edit`);
  };

  return (
    <div style={{ display: "flex", padding: "20px", gap: "20px" }}>
      <div
        style={{
          flex: 1,
          textAlign: "center",
          borderRight: "1px solid #ccc",
          paddingRight: "20px",
        }}
      >
        <h2>Your username: {username}</h2>
        <h1>My Ads</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {myAds.length > 0 ? (
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {myAds.map((task) => (
              <li
                key={task.id}
                style={{
                  border: "1px solid #ccc",
                  margin: "10px",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                <h4>{task.subject}</h4>
                <p>{task.description}</p>
                <p>Level: {task.level}</p>
                <p>Learning Mode: {task.learning_mode}</p>
                <p>Frequency: {task.frequency}</p>
                <p>Start Date: {task.start_date}</p>
                <p>
                  <strong>Assigned Username:</strong>{" "}
                  {task.assignedUsername ? task.assignedUsername : "None"}
                </p>
                <button
                  className="category-button"
                  style={{ marginRight: "10px" }}
                  onClick={() => handleEdit(task.id)}
                >
                  Edit
                </button>
                <button
                  className="category-button"
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No ads found for this user.</p>
        )}
      </div>

      <div style={{ flex: 1, textAlign: "center", paddingLeft: "20px" }}>
        <h1>Assigned Ads</h1>
        {assignedAds.length > 0 ? (
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {assignedAds.map((task) => (
              <li
                key={task.id}
                style={{
                  border: "1px solid #ccc",
                  margin: "10px",
                  padding: "10px",
                  borderRadius: "5px",
                }}
              >
                <h4>{task.subject}</h4>
                <p>{task.description}</p>
                <p>Level: {task.level}</p>
                <p>Learning Mode: {task.learning_mode}</p>
                <p>Frequency: {task.frequency}</p>
                <p>Start Date: {task.start_date}</p>
                <button
                  className="category-button"
                  onClick={() => handleUnassign(task.id)}
                >
                  Unassign
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No assigned ads found.</p>
        )}
      </div>
    </div>
  );
};

export default Account;
