import React, { useState } from "react";
import "./Add.css";

const Add: React.FC = () => {
  const [subject, setSubject] = useState("Matematyka");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("Liceum");
  const [learningMode, setLearningMode] = useState("Offline (spotkania na żywo)");
  const [frequency, setFrequency] = useState("Raz w tygodniu");
  const [startDate, setStartDate] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const token = sessionStorage.getItem("accessToken"); 
    const username = localStorage.getItem("username");
    

    const adData = {
      subject,
      description,
      level,
      learning_mode: learningMode,
      frequency,
      start_date: startDate || null,
      username: username,
    };

    try {
      const response = await fetch("http://localhost:8000/api/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify(adData),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Ogłoszenie zostało dodane pomyślnie!");
        console.log(data);
      } else {
        const errorData = await response.json();
        console.error("Błąd:", errorData);
        alert("Wystąpił błąd przy dodawaniu ogłoszenia.");
      }
    } catch (error) {
      console.error("Błąd połączenia:", error);
      alert("Nie udało się połączyć z serwerem.");
    }
  };

  return (
    <div className="add-container">
      <h1 className="add-title">Dodaj ogłoszenie</h1>
      <form className="add-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Przedmiot / Temat nauki (wymagane)</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          >
            <option>Matematyka</option>
            <option>Fizyka</option>
            <option>Chemia</option>
            <option>Biologia</option>
            <option>Język angielski</option>
            <option>Język hiszpański</option>
            <option>Język polski</option>
            <option>Historia</option>
          </select>
        </div>
        <div className="form-group">
          <label>Poziom nauki (opcjonalne)</label>
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option>Liceum</option>
            <option>Studia</option>
            <option>Podstawówka</option>
          </select>
        </div>
        <div className="form-group">
          <label>Opis ogłoszenia (wymagane)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Napisz coś"
            required
          />
        </div>
        <div className="form-group">
          <label>Forma nauki (wymagana)</label>
          <select
            value={learningMode}
            onChange={(e) => setLearningMode(e.target.value)}
            required
          >
            <option>Offline (spotkania na żywo)</option>
            <option>Online</option>
          </select>
        </div>
        <div className="form-group">
          <label>Częstotliwość spotkań (opcjonalne)</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option>Raz w tygodniu</option>
            <option>Dwa razy w tygodniu</option>
            <option>Codziennie</option>
            <option>Raz w miesiącu</option>
            <option>Raz na dwa tygodnie</option>
          </select>
        </div>
        <div className="form-group">
          <label>Data rozpoczęcia nauki (opcjonalne)</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="form-actions">
          <button type="button" className="cancel-button">
            Anuluj
          </button>
          <button type="submit" className="submit-button">
            Opublikuj
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add;
