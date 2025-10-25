import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Chatbot from './pages/Chatbot';
import WeatherPrediction from './pages/WeatherPrediction';
import News from './pages/News';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/weather" element={<WeatherPrediction />} />
            <Route path="/news" element={<News />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;