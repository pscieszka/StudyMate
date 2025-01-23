import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import "./Account.css";

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
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAds = async () => {
            const savedUsername = localStorage.getItem("username");
            const token = sessionStorage.getItem("accessToken");

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
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                setAssignedAds((prevAds) => prevAds.filter((ad) => ad.id !== taskId)); // Usuń ogłoszenie z listy przypisanych
            } else {
                alert("Failed to unassign the ad.");
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            alert("Something went wrong. Please try again.");
        }
    };

    const handleEdit = (taskId: number) => {
        navigate(`/ads/id/${taskId}/edit`);
    };

    return (
        <div className="container">
            <div className="section section-left">
                <h1>My Ads</h1>
                {error && <p className="error-message">{error}</p>}
                {myAds.length > 0 ? (
                    <ul className="list">
                        {myAds.map((task) => (
                            <li key={task.id} className="list-item">
                                <div className="left-container">
                                    <h4>{task.subject}</h4>
                                    <p>{task.description}</p>
                                    {task.assignedUsername && (
                                        <p>
                                            <strong>Assigned Username:</strong>{" "}
                                            {task.assignedUsername ? task.assignedUsername : "None"}
                                        </p>
                                    )}

                                </div>
                                <div className="right-container">
                                    <p>
                                        <strong>Level:</strong>
                                        {task.level}
                                    </p>
                                    {task.learning_mode && (
                                        <p>
                                            <strong>Learning Mode:</strong> {task.learning_mode}
                                        </p>
                                    )}
                                    {task.frequency && (
                                        <p>
                                            <strong>Frequency:</strong> {task.frequency}
                                        </p>
                                    )}
                                    {task.start_date && (
                                        <p>
                                            <strong>Start Date:</strong> {task.start_date}
                                        </p>
                                    )}
                                </div>
                                <div className="button-container">
                                    <button
                                        className="ad-button"
                                        onClick={() => handleEdit(task.id)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="ad-button"
                                        onClick={() => handleDelete(task.id)}
                                    >
                                        Delete
                                    </button>
                                </div>

                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No ads found for this user.</p>
                )}
            </div>

            <div className="section section-right">
                <h1>Assigned Ads</h1>
                {assignedAds.length > 0 ? (
                    <ul className="list">
                        {assignedAds.map((task) => (
                            <li key={task.id} className="list-item">
                                <div className="left-container">
                                    <h4>{task.subject}</h4>
                                    <p>{task.description}</p>
                                </div>

                                <div className="right-container">
                                    <p>
                                        <strong>Level:</strong>
                                        {task.level}
                                    </p>
                                    {task.learning_mode && (
                                        <p>
                                            <strong>Learning Mode:</strong> {task.learning_mode}
                                        </p>
                                    )}
                                    {task.frequency && (
                                        <p>
                                            <strong>Frequency:</strong> {task.frequency}
                                        </p>
                                    )}
                                    {task.start_date && (
                                        <p>
                                            <strong>Start Date:</strong> {task.start_date}
                                        </p>
                                    )}
                                </div>

                                <div className="button-container">
                                    <button
                                        className="ad-button"
                                        onClick={() => handleUnassign(task.id)}
                                    >
                                        Unassign
                                    </button>
                                </div>
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
