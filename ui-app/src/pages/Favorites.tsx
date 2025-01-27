import React, { useEffect, useState } from "react";
import "./Favorites.css";

interface Ad {
    id: number;
    title: string;
    description: string;
    subject: string;
    level: string;
    learning_mode: string;
    frequency: string;
    start_date: string | null;
    username: string;
    assignedUsername: string | null;
}

const Favorites: React.FC = () => {
    const [favorites, setFavorites] = useState<number[]>([]);
    const [userUsername, setUserUsername] = useState<string | null>(null);
    const [confirmationAdId, setConfirmationAdId] = useState<number | null>(null);
    const [ads, setAds] = useState<Ad[]>([]);

    useEffect(() => {
        const fetchFavoriteIds = async () => {
            const token = sessionStorage.getItem("accessToken");
            try {
                const response = await fetch("http://localhost:8000/api/favorites", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const ids = await response.json();
                    setFavorites(ids);
                } else {
                    console.error("Error fetching favorites ID");
                }
            } catch (error) {
                console.error("Connection error:", error);
            }
        };

        const fetchUserDetails = async () => {
            const token = sessionStorage.getItem("accessToken");
            try {
                const response = await fetch("http://localhost:8000/api/userinfo", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserUsername(data.username);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchFavoriteIds();
        fetchUserDetails();
    }, []);

    useEffect(() => {
        const fetchFavoriteDetails = async () => {
            const token = sessionStorage.getItem("accessToken");
            try {
                const promises = favorites.map((id) =>
                    fetch(`http://localhost:8000/api/ads/id/${id}/`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }).then((response) => response.json())
                );

                const favoriteDetails = await Promise.all(promises);
                setAds(favoriteDetails);
            } catch (error) {
                console.error("Error while fetching ad details:", error);
            }
        };

        if (favorites.length > 0) {
            fetchFavoriteDetails();
        }
    }, [favorites]);

    const handleAdClick = (adId: number) => {
        const ad = ads.find((ad) => ad.id === adId);
        const token = sessionStorage.getItem("accessToken");

        if (!token) {
            alert("You must be logged in to apply for an ad!");
            return;
        }

        if (ad?.username === userUsername) {
            alert("You cannot apply for your own ad!");
            return;
        }

        setConfirmationAdId(adId);
    };

    const confirmApplication = async () => {
        const token = sessionStorage.getItem("accessToken");

        if (!confirmationAdId || !userUsername) return;

        try {
            const response = await fetch(
                `http://localhost:8000/api/ads/apply/${confirmationAdId}/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ assignedUsername: userUsername }),
                }
            );

            if (response.ok) {
                window.location.reload();
                alert("Successfully applied for the ad!");
            } else {
                alert("Failed to apply for the ad.");
            }
        } catch (error) {
            console.error("Error during application:", error);
        } finally {
            setConfirmationAdId(null);
        }
    };

    const cancelApplication = () => {
        setConfirmationAdId(null);
    };

    const toggleFavorite = async (adId: number) => {
        const isFavorite = favorites.includes(adId);
        const token = sessionStorage.getItem("accessToken");

        try {
            const response = await fetch(
                `http://localhost:8000/api/favorites/${isFavorite ? "remove" : "add"}/${adId}/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                setFavorites((prevFavorites) =>
                    isFavorite
                        ? prevFavorites.filter((id) => id !== adId)
                        : [...prevFavorites, adId]
                );
            } else {
                console.error("Error updating favorites");
            }
        } catch (error) {
            console.error("Connection error:", error);
        }
    };

    return (
        <div className="favorites-container">
            <h1 className="favorites-title">Your favorite ads</h1>
            {ads.length > 0 ? (
                <div className="favorites-grid">
                    {ads.map((ad) => (
                        <div key={ad.id} className="ad-card">
                            <div className="avatar-container">
                                <i className="fa-solid fa-chalkboard-user input-icon"></i>
                            </div>
                            <div className="left-container">
                                <p className="ad-subject">
                                    <strong>{ad.subject}</strong>
                                </p>
                                <p className="ad-description">{ad.description}</p>
                                <p className="ad-user">
                                    <strong>User:</strong> {ad.username}
                                </p>
                            </div>
                            <div className="right-container">
                                <p>
                                    <strong>Level:</strong> {ad.level}
                                </p>
                                {ad.learning_mode && (
                                    <p>
                                        <strong>Learning Mode:</strong> {ad.learning_mode}
                                    </p>
                                )}
                                {ad.frequency && (
                                    <p>
                                        <strong>Frequency:</strong> {ad.frequency}
                                    </p>
                                )}
                                {ad.start_date && (
                                    <p>
                                        <strong>Start Date:</strong> {ad.start_date}
                                    </p>
                                )}
                            </div>
                            <div className="button-container">
                                <div className="fav-button-container">
                                    <button
                                        className={`favorite-button ${
                                            favorites.includes(ad.id) ? "favorited" : ""
                                        }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleFavorite(ad.id);
                                        }}
                                    >
                                        <i
                                            className={`${
                                                favorites.includes(ad.id)
                                                    ? "fa-solid fa-heart"
                                                    : "fa-regular fa-heart"
                                            }`}
                                        ></i>
                                    </button>
                                </div>
                                <div className="apply-button-container">
                                    <button
                                        className="apply-button"
                                        onClick={() => handleAdClick(ad.id)}
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-favorites">You don't have any favorite ads yet.</p>
            )}
            {confirmationAdId !== null && (
                <div className="confirmation-dialog">
                    <div className="confirmation-content">
                        <p>Are you sure you want to apply for this ad?</p>
                        <button onClick={confirmApplication}>Yes</button>
                        <button onClick={cancelApplication}>No</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Favorites;
