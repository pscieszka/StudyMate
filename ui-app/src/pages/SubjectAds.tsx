import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import "./SubjectAds.css";

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

const SubjectAds: React.FC = () => {
    const {subject, query} = useParams<{ subject?: string; query?: string }>();
    const [ads, setAds] = useState<Ad[]>([]);
    const [filteredAds, setFilteredAds] = useState<Ad[]>([]);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [userUsername, setUserUsername] = useState<string | null>(null);
    const [confirmationAdId, setConfirmationAdId] = useState<number | null>(null);
    const [filters, setFilters] = useState({
        level: "",
        learning_mode: "",
        frequency: "",
        start_date: "",
    });

    useEffect(() => {
        const fetchAds = async () => {
            try {
                let url = "";
                if (subject) {
                    url = `http://localhost:8000/api/ads/?subject=${encodeURIComponent(subject)}`;
                } else if (query) {
                    url = `http://localhost:8000/api/search/${encodeURIComponent(query)}/`;
                }

                if (url) {
                    const response = await fetch(url);
                    if (response.ok) {
                        const data = await response.json();
                        const unassignedAds = data.filter((ad: Ad) => ad.assignedUsername === null);
                        setAds(unassignedAds);
                        setFilteredAds(unassignedAds);
                    } else {
                        console.error("Error fetching ads.");
                    }
                }
            } catch (error) {
                console.error("Connection error:", error);
            }
        };

        const fetchUserDetails = async () => {
            const token = sessionStorage.getItem("accessToken");
            try {
                const response = await fetch("http://localhost:8000/api/userinfo", {
                    headers: {Authorization: `Bearer ${token}`},
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserUsername(data.username);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        const fetchFavoriteIds = async () => {
            const token = sessionStorage.getItem("accessToken");
            try {
                const response = await fetch("http://localhost:8000/api/favorites", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const favoriteIds = await response.json();
                    setFavorites(favoriteIds); // Ustaw listę ulubionych ogłoszeń
                } else {
                    console.error("Error fetching favorites.");
                }
            } catch (error) {
                console.error("Connection error:", error);
            }
        };

        fetchAds();
        fetchUserDetails();
        fetchFavoriteIds();
    }, [subject, query]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        const updatedFilters = {...filters, [name]: value};

        const filtered = ads.filter((ad) =>
            Object.entries(updatedFilters).every(([key, filterValue]) => {
                if (!filterValue) return true;
                const adValue = (ad[key as keyof Ad] as string).toLowerCase();
                return adValue === filterValue.toLowerCase();
            })
        );

        setFilters(updatedFilters);
        setFilteredAds(filtered);
    };

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
                    body: JSON.stringify({assignedUsername: userUsername}),
                }
            );

            if (response.ok) {
                window.location.reload();
                alert("Successfully applied for the ad!");
            } else {
                alert(" Failed to apply for the ad.");
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
        const token = sessionStorage.getItem("accessToken");

        if (!token) {
            alert("You must be logged in to add ads to your favorites!");
            return;
        }

        const isFavorite = favorites.includes(adId);
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
        <div className="ads-container">
            <h1 className="ads-title">
                {subject
                    ? `Findings`
                    : `Search results for: ${query}`}
            </h1>

            <div className="filters">
                <div className="select-container">
                    <i className="fa-solid fa-graduation-cap select-icon"></i>
                    <select
                        name="level"
                        value={filters.level}
                        onChange={handleFilterChange}
                        className="filter-select"
                    >
                        <option value="">Level</option>
                        <option value="High School">High School</option>
                        <option value="University">University</option>
                        <option value="Primary School">Primary School</option>
                    </select>
                </div>

                <div className="select-container">
                    <i className="fa-solid fa-users select-icon"></i>
                    <select
                        name="learning_mode"
                        value={filters.learning_mode}
                        onChange={handleFilterChange}
                        className="filter-select"
                    >
                        <option value="">Study Mode</option>
                        <option value="online">Online</option>
                        <option value="In-person meetings">In-person meetings</option>
                    </select>
                </div>
                <div className="select-container">
                    <i className="fa-solid fa-calendar-days select-icon"></i>
                    <select
                        name="frequency"
                        value={filters.frequency}
                        onChange={handleFilterChange}
                        className="filter-select"
                    >
                        <option value="">Frequency</option>
                        <option value="Once a week">Once a week</option>
                        <option value="Twice a week">Twice a week</option>
                        <option value="Daily">Daily</option>
                        <option value="Once a month">Once a month</option>
                        <option value="Every two weeks">Every two weeks</option>
                    </select>
                </div>
            </div>

            {filteredAds.length > 0 ? (
                <div className="ads-grid">
                    {filteredAds.map((ad) => (
                        <div
                            key={ad.id}
                            className="ad-card"
                        >
                            <div className="avatar-container">
                                <i className="fa-solid fa-chalkboard-user input-icon"></i>
                            </div>
                            <div className="left-container">
                                <p className="ad-subject">
                                    <strong>{ad.subject}</strong>
                                </p>
                                <p className="ad-description">
                                    {ad.description}
                                </p>
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
                                        <i className={`${favorites.includes(ad.id) ? "fa-solid fa-heart" : "fa-regular fa-heart"}`}></i>
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
                <p className="no-ads">No available ads.</p>
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

export default SubjectAds;
