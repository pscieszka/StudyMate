import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Navbar from "./components/Navbar";
import Add from "./pages/Add";
import Account from "./pages/Account";
import "./App.css";
import Home from "./pages/Home.tsx";
import SubjectAds from "./pages/SubjectAds";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/home" element={<Home/>}/>
        <Route path="/add" element={<Add />} />
        <Route path="/account" element={<Account />} />
          <Route path="/ads/:subject" element={<SubjectAds/>} />
        <Route path="/" element={<Home/>} />
      </Routes>
    </Router>
  );
}

export default App;
