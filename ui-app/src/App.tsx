import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Navbar from "./components/Navbar";
import Add from "./pages/Add";
import Account from "./pages/Account";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/home"
          element={
            <div className="home-content">
              <h1>Welcome to StudyMate!</h1>
              <p>Start exploring and adding your tasks.</p>
            </div>
          }
        />

        <Route path="/add" element={<Add />} />
        <Route path="/account" element={<Account />} />

        <Route path="/" element={<div>home</div>} />
      </Routes>
    </Router>
  );
}

export default App;
