import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css';
import Register from "./components/templates/Register";
import FrontPage from "./components/templates/FrontPage";
import Login from "./components/templates/Login";
import Post from "./components/templates/Post";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<FrontPage />} />
          <Route  path="/login" element={ <Login /> } />
          <Route  path="/register" element={ <Register /> } />
          <Route  path="/post" element={ <Post /> } />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
