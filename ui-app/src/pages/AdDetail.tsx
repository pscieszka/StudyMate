import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./AdDetail.css";

interface Ad {
  id: number;
  subject: string;
  description: string;
  level: string;
  learning_mode: string;
  frequency: string;
  start_date: string | null;
  username: string | null;
}

const AdDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/ads/id/${id}/`);
        if (response.ok) {
          const data = await response.json();
          setAd(data);
        } else {
          setError("Ogłoszenie nie zostało znalezione.");
        }
      } catch (err) {
        setError("Wystąpił błąd podczas ładowania ogłoszenia.");
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [id]);

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="ad-detail-container">
      <h1>{ad?.subject}</h1>
      <p><strong>Opis:</strong> {ad?.description}</p>
      <p><strong>Poziom:</strong> {ad?.level}</p>
      <p><strong>Forma nauki:</strong> {ad?.learning_mode}</p>
      <p><strong>Częstotliwość:</strong> {ad?.frequency}</p>
      {ad?.start_date && <p><strong>Data rozpoczęcia:</strong> {ad.start_date}</p>}
      <p><strong>Utworzone przez:</strong> {ad?.username || "Nieznany"}</p>
    </div>
  );
};

export default AdDetail;
