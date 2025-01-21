import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  username: string; // Właściciel ogłoszenia
  assignedUsername: string | null; // Przypisany użytkownik
}

const SubjectAds: React.FC = () => {
  const { subject, query } = useParams<{ subject?: string; query?: string }>();
  const [ads, setAds] = useState<Ad[]>([]); // Wszystkie ogłoszenia
  const [filteredAds, setFilteredAds] = useState<Ad[]>([]); // Ogłoszenia po filtrach
  const [favorites, setFavorites] = useState<number[]>([]); // Lista ID ulubionych ogłoszeń
  const [userUsername, setUserUsername] = useState<string | null>(null); // Nazwa użytkownika
  const [confirmationAdId, setConfirmationAdId] = useState<number | null>(null); // ID ogłoszenia do potwierdzenia
  const [filters, setFilters] = useState({
    level: "",
    learning_mode: "",
    frequency: "",
    start_date: "",
  });

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
            // Filtrowanie ogłoszeń, aby wyświetlać tylko te z assignedUsername === null
            const unassignedAds = data.filter((ad: Ad) => ad.assignedUsername === null);
            setAds(unassignedAds);
            setFilteredAds(unassignedAds); // Początkowo brak filtrów
          } else {
            console.error("Błąd podczas pobierania ogłoszeń");
          }
        }
      } catch (error) {
        console.error("Błąd połączenia:", error);
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
        console.error("Błąd podczas pobierania danych użytkownika:", error);
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
    fetchUserDetails();
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
    const ad = ads.find((ad) => ad.id === adId);
    const token = sessionStorage.getItem("accessToken");

    if (!token) {
      alert("Musisz być zalogowany, aby zgłosić się do ogłoszenia!");
      return;
    }

    if (ad?.username === userUsername) {
      alert("Nie możesz zgłosić się do własnego ogłoszenia!");
      return;
    }

    setConfirmationAdId(adId); // Otwórz dialog potwierdzenia
  };

  // Potwierdzenie zgłoszenia
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
        alert("Zgłoszono się do ogłoszenia!");
      } else {
        alert("Nie udało się zgłosić do ogłoszenia.");
      }
    } catch (error) {
      console.error("Błąd podczas zgłoszenia:", error);
    } finally {
      setConfirmationAdId(null); // Zamknij dialog
    }
  };

  // Anulowanie zgłoszenia
  const cancelApplication = () => {
    setConfirmationAdId(null); // Zamknij dialog
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
        <p className="no-ads">Brak dostępnych ogłoszeń.</p>
      )}

      {/* Dialog potwierdzenia */}
      {confirmationAdId !== null && (
        <div className="confirmation-dialog">
          <div className="confirmation-content">
            <p>Czy na pewno chcesz się zgłosić do tego ogłoszenia?</p>
            <button onClick={confirmApplication}>Tak</button>
            <button onClick={cancelApplication}>Nie</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectAds;
