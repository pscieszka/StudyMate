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
}

const Account: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string>("");
  const [username, setUsername] = useState<string | null>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      const savedUsername = localStorage.getItem("username");
      const token = sessionStorage.getItem("accessToken");
      setUsername(savedUsername);

      if (!savedUsername) {
        setError("You are not logged in or your session has expired.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/api/ads/${savedUsername}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          setError("Failed to fetch tasks. Please check your login status.");
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
      }
    };

    fetchTasks();
  }, []);

  const handleDelete = async (taskId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/ads/id/${taskId}/delete/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });

      if (response.ok) {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      } else {
        alert("Failed to delete the task.");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  const handleEdit = (taskId: number) => {
    navigate(`/ads/id/${taskId}/edit`);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {username && <h2>Your username: {username}</h2>}
      <h1>My Tasks</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {tasks.length > 0 ? (
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {tasks.map((task) => (
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
                style={{ marginRight: "10px" }}
                onClick={() => handleEdit(task.id)}
              >
                Edit
              </button>
              <button 
              className="category-button"
              onClick={() => handleDelete(task.id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks found for this user.</p>
      )}
    </div>
  );
};

export default Account;
