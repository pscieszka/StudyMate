import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./SubjectAds.css";

// Definicja interfejsu ogłoszenia
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

const SubjectAds: React.FC = () => {
  const { subject, query } = useParams<{ subject?: string; query?: string }>();
  const [ads, setAds] = useState<Ad[]>([]); // Wszystkie ogłoszenia
  const [filteredAds, setFilteredAds] = useState<Ad[]>([]); // Ogłoszenia po filtrach
  const [favorites, setFavorites] = useState<number[]>([]); // Lista ID ulubionych ogłoszeń
  const [filters, setFilters] = useState({
    level: "",
    learning_mode: "",
    frequency: "",
    start_date: "",
  });
  const navigate = useNavigate();

  // Pobieranie ogłoszeń i ulubionych przy załadowaniu komponentu
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
            setAds(data);
            setFilteredAds(data); // Początkowo brak filtrów
          } else {
            console.error("Błąd podczas pobierania ogłoszeń");
          }
        }
      } catch (error) {
        console.error("Błąd połączenia:", error);
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
          console.error("Błąd podczas pobierania ulubionych");
        }
      } catch (error) {
        console.error("Błąd połączenia:", error);
      }
    };

    fetchAds();
    fetchFavoriteIds();
  }, [subject, query]);

  // Obsługa filtrów
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };

    const filtered = ads.filter((ad) =>
      Object.entries(updatedFilters).every(([key, filterValue]) => {
        if (!filterValue) return true; // Jeśli brak wartości filtra
        const adValue = (ad[key as keyof Ad] as string).toLowerCase();
        return adValue === filterValue.toLowerCase();
      })
    );

    setFilters(updatedFilters);
    setFilteredAds(filtered); // Zaktualizowane ogłoszenia
  };

  // Obsługa kliknięcia na ogłoszenie
  const handleAdClick = (adId: number) => {
    navigate(`/ads/id/${adId}`);
  };

  // Dodanie/usunięcie ulubionego
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
            ? prevFavorites.filter((id) => id !== adId) // Usuń z ulubionych
            : [...prevFavorites, adId] // Dodaj do ulubionych
        );
      } else {
        console.error("Błąd podczas aktualizacji ulubionych");
      }
    } catch (error) {
      console.error("Błąd połączenia:", error);
    }
  };

  return (
    <div className="ads-container">
      <h1 className="ads-title">
        {subject
          ? `Ogłoszenia dla: ${subject}`
          : `Wyniki wyszukiwania dla: ${query}`}
      </h1>

      {/* Filtry */}
      <div className="filters">
        <select
          name="level"
          value={filters.level}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">Poziom (wszystkie)</option>
          <option value="Liceum">Liceum</option>
          <option value="Studia">Studia</option>
          <option value="Podstawówka">Podstawówka</option>
        </select>
        <select
          name="learning_mode"
          value={filters.learning_mode}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">Forma nauki (wszystkie)</option>
          <option value="online">Online</option>
          <option value="offline">Stacjonarna</option>
        </select>
        <select
          name="frequency"
          value={filters.frequency}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="">Częstotliwość (wszystkie)</option>
          <option value="Raz w tygodniu">Raz w tygodniu</option>
          <option value="Dwa razy w tygodniu">Dwa razy w tygodniu</option>
          <option value="Codziennie">Codziennie</option>
          <option value="Raz w miesiącu">Raz w miesiącu</option>
          <option value="Raz na dwa tygodnie">Raz na dwa tygodnie</option>
        </select>
      </div>

      {filteredAds.length > 0 ? (
        <div className="ads-grid">
          {filteredAds.map((ad) => (
            <div
              key={ad.id}
              className="ad-card"
              onClick={() => handleAdClick(ad.id)}
            >
              <h2 className="ad-title">{ad.title}</h2>
              <p className="ad-subject">
                <strong>Przedmiot:</strong> {ad.subject}
              </p>
              <p className="ad-description">
                <strong>Opis:</strong> {ad.description}
              </p>
              <p>
                <strong>Poziom:</strong> {ad.level}
              </p>
              <p>
                <strong>Forma nauki:</strong> {ad.learning_mode}
              </p>
              <p>
                <strong>Częstotliwość:</strong> {ad.frequency}
              </p>
              {ad.start_date && (
                <p>
                  <strong>Data rozpoczęcia:</strong> {ad.start_date}
                </p>
              )}
              <button
                className={`favorite-button ${
                  favorites.includes(ad.id) ? "favorited" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation(); 
                  toggleFavorite(ad.id);
                }}
              >
                {favorites.includes(ad.id) ? "❤️" : "♡"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-ads">Brak ogłoszeń spełniających kryteria.</p>
      )}
    </div>
  );
};

export default SubjectAds;
