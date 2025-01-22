import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
}

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Ad[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const navigate = useNavigate();

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
          setFavoriteIds(ids);
        } else {
          console.error("Błąd podczas pobierania ulubionych ID");
        }
      } catch (error) {
        console.error("Błąd połączenia:", error);
      }
    };

    fetchFavoriteIds();
  }, []);

  useEffect(() => {
    const fetchFavoriteDetails = async () => {
      const token = sessionStorage.getItem("accessToken");
      try {
        const promises = favoriteIds.map((id) =>
          fetch(`http://localhost:8000/api/ads/id/${id}/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((response) => response.json())
        );

        const favoriteDetails = await Promise.all(promises);
        setFavorites(favoriteDetails); 
      } catch (error) {
        console.error("Błąd podczas pobierania szczegółów ogłoszeń:", error);
      }
    };

    if (favoriteIds.length > 0) {
      fetchFavoriteDetails();
    }
  }, [favoriteIds]);

  const handleAdClick = (adId: number) => {
    navigate(`/ads/${adId}`);
  };

  return (
    <div className="favorites-container">
      <h1 className="favorites-title">Twoje ulubione ogłoszenia</h1>
      {favorites.length > 0 ? (
        <div className="favorites-grid">
          {favorites.map((ad) => (
            <div
              key={ad.id}
              className="favorite-card"
              onClick={() => handleAdClick(ad.id)}
            >
              <h2 className="favorite-title">{ad.title}</h2>
              <p><strong>Przedmiot:</strong> {ad.subject}</p>
              <p><strong>Opis:</strong> {ad.description}</p>
              <p><strong>Poziom:</strong> {ad.level}</p>
              <p><strong>Forma nauki:</strong> {ad.learning_mode}</p>
              <p><strong>Częstotliwość:</strong> {ad.frequency}</p>
              {ad.start_date && (
                <p><strong>Data rozpoczęcia:</strong> {ad.start_date}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="no-favorites">Nie masz jeszcze ulubionych ogłoszeń.</p>
      )}
    </div>
  );
};

export default Favorites;
