import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
  const { subject } = useParams<{ subject: string }>();
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    // Pobierz ogłoszenia dla danego przedmiotu
    const fetchAds = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/ads/?subject=${encodeURIComponent(subject || "")}`
        );
        if (response.ok) {
          const data = await response.json();
          setAds(data);
        } else {
          console.error("Błąd podczas pobierania ogłoszeń");
        }
      } catch (error) {
        console.error("Błąd połączenia:", error);
      }
    };

    fetchAds();
  }, [subject]);

  return (
    <div>
      <h1>Ogłoszenia dla: {subject}</h1>
      {ads.length > 0 ? (
        <ul>
          {ads.map((ad) => (
              <li key={ad.id}>
                  <h2>{ad.subject}</h2>
                  <p>{ad.description}</p>
                  <p><strong>Poziom: </strong>{ad.level}</p>
                  <p><strong>Forma nauki: </strong>{ad.learning_mode}</p>
                  <p><strong>Częstotliwość: </strong>{ad.frequency}</p>
                  {ad.start_date && <p><strong>Data rozpoczęcia: </strong>{ad.start_date}</p>}
              </li>
          ))}
        </ul>
      ) : (
          <p>Brak ogłoszeń dla wybranego przedmiotu.</p>
      )}
    </div>
  );
};

export default SubjectAds;
