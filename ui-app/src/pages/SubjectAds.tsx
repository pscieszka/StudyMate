import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
}

const SubjectAds: React.FC = () => {
  const { subject, query } = useParams<{ subject?: string; query?: string }>();  // Pobieramy zarówno 'subject' jak i 'query'
  const [ads, setAds] = useState<Ad[]>([]);
  const [filteredAds, setFilteredAds] = useState<Ad[]>([]);
  const [filters, setFilters] = useState({
    level: "",
    learning_mode: "",
    frequency: "",
    start_date: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAds = async () => {
      try {
        let url = "";
        if (subject) {
          // Jeśli mamy 'subject', to pobieramy ogłoszenia dla tego przedmiotu
          url = `http://localhost:8000/api/ads/?subject=${encodeURIComponent(subject)}`;
        } else if (query) {
          // Jeśli mamy 'query', to pobieramy ogłoszenia związane z tym zapytaniem
          url = `http://localhost:8000/api/search/${encodeURIComponent(query)}/`;
        }

        if (url) {
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            setAds(data);
            setFilteredAds(data);
          } else {
            console.error("Error fetching ads");
          }
        }
      } catch (error) {
        console.error("Connection error:", error);
      }
    };

    fetchAds();
  }, [subject, query]); // Ponownie uruchom, gdy subject lub query się zmieni

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const normalizedFilters = { ...filters, [name]: value };

    // Normalize specific filter values for comparison
    const normalizeValue = (key: string, val: string) => {
      if (key === "learning_mode") {
        return val === "Offline (spotkania na żywo)" ? "offline" : val.toLowerCase();
      }
      if (key === "frequency") {
        return val.toLowerCase();
      }
      return val;
    };

    const filtered = ads.filter((ad) =>
      Object.entries(normalizedFilters).every(([key, filterValue]) => {
        if (filterValue === "") return true; // Ignore empty filters
        const adValue = normalizeValue(key, ad[key as keyof Ad] as string);
        const normalizedFilterValue = normalizeValue(key, filterValue);
        return adValue === normalizedFilterValue;
      })
    );

    setFilters(normalizedFilters);
    setFilteredAds(filtered);
  };

  const handleAdClick = (adId: number) => {
    navigate(`/ads/${adId}`);
  };

  return (
    <div className="ads-container">
      <h1 className="ads-title">{subject ? `Ogłoszenia dla: ${subject}` : `Wyniki wyszukiwania dla: ${query}`}</h1>

      {/* Filters */}
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

                <p className="ad-subject"><strong>Przedmiot:</strong> {ad.subject}</p>
                <p className="ad-description"><strong>Opis:</strong> {ad.description}</p>
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
          <p className="no-ads">Brak ogłoszeń spełniających kryteria.</p>
      )}
    </div>
  );
};

export default SubjectAds;
