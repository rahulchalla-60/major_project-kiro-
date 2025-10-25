import React, { useState, useEffect } from 'react';
import './WeatherPrediction.css';

const WeatherPrediction = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('delhi');
  const [loading, setLoading] = useState(false);

  const locations = [
    { value: 'delhi', label: 'Delhi', coordinates: { lat: 28.6139, lon: 77.2090 } },
    { value: 'mumbai', label: 'Mumbai', coordinates: { lat: 19.0760, lon: 72.8777 } },
    { value: 'bangalore', label: 'Bangalore', coordinates: { lat: 12.9716, lon: 77.5946 } },
    { value: 'chennai', label: 'Chennai', coordinates: { lat: 13.0827, lon: 80.2707 } },
    { value: 'kolkata', label: 'Kolkata', coordinates: { lat: 22.5726, lon: 88.3639 } },
    { value: 'hyderabad', label: 'Hyderabad', coordinates: { lat: 17.3850, lon: 78.4867 } },
    { value: 'pune', label: 'Pune', coordinates: { lat: 18.5204, lon: 73.8567 } },
    { value: 'jaipur', label: 'Jaipur', coordinates: { lat: 26.9124, lon: 75.7873 } }
  ];

  // Mock weather data generator
  const generateMockWeatherData = (location) => {
    const baseTemp = Math.random() * 15 + 20; // 20-35°C
    const baseHumidity = Math.random() * 30 + 50; // 50-80%
    const baseRainfall = Math.random() * 20; // 0-20mm
    
    const forecast = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      forecast.push({
        date: date.toLocaleDateString(),
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        temperature: {
          max: Math.round(baseTemp + Math.random() * 8 - 4),
          min: Math.round(baseTemp - 5 + Math.random() * 4)
        },
        humidity: Math.round(baseHumidity + Math.random() * 20 - 10),
        rainfall: Math.round(baseRainfall + Math.random() * 10 - 5),
        windSpeed: Math.round(Math.random() * 15 + 5),
        condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Thunderstorm'][Math.floor(Math.random() * 5)],
        icon: ['☀️', '⛅', '☁️', '🌧️', '⛈️'][Math.floor(Math.random() * 5)]
      });
    }
    
    return {
      location: locations.find(loc => loc.value === location)?.label || location,
      current: forecast[0],
      forecast: forecast,
      farmingAdvice: generateFarmingAdvice(forecast[0])
    };
  };

  const generateFarmingAdvice = (currentWeather) => {
    const advice = [];
    
    if (currentWeather.rainfall > 15) {
      advice.push("🌧️ Heavy rainfall expected - ensure proper drainage in fields");
      advice.push("🚜 Postpone harvesting activities if possible");
      advice.push("🌱 Good time for transplanting rice and other water-loving crops");
    } else if (currentWeather.rainfall < 5) {
      advice.push("☀️ Low rainfall - consider irrigation for water-sensitive crops");
      advice.push("🌾 Good conditions for harvesting mature crops");
      advice.push("💧 Monitor soil moisture levels closely");
    }
    
    if (currentWeather.temperature.max > 35) {
      advice.push("🌡️ High temperatures - provide shade for livestock");
      advice.push("🕐 Schedule farm work during cooler hours (early morning/evening)");
    } else if (currentWeather.temperature.max < 20) {
      advice.push("❄️ Cool weather - protect sensitive crops from cold");
      advice.push("🔥 Consider frost protection measures");
    }
    
    if (currentWeather.humidity > 80) {
      advice.push("💨 High humidity - watch for fungal diseases in crops");
      advice.push("🍃 Ensure good air circulation in greenhouses");
    }
    
    if (currentWeather.windSpeed > 20) {
      advice.push("💨 Strong winds expected - secure loose structures");
      advice.push("🌿 Protect young plants from wind damage");
    }
    
    return advice.length > 0 ? advice : ["🌱 Normal weather conditions - continue regular farming activities"];
  };

  useEffect(() => {
    fetchWeatherData();
  }, [selectedLocation]);

  const fetchWeatherData = async () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockData = generateMockWeatherData(selectedLocation);
      setWeatherData(mockData);
      setLoading(false);
    }, 1000);
  };

  const getWeatherIcon = (condition) => {
    const icons = {
      'Sunny': '☀️',
      'Partly Cloudy': '⛅',
      'Cloudy': '☁️',
      'Rainy': '🌧️',
      'Thunderstorm': '⛈️'
    };
    return icons[condition] || '🌤️';
  };

  const getTemperatureColor = (temp) => {
    if (temp > 35) return 'hot';
    if (temp > 25) return 'warm';
    if (temp > 15) return 'mild';
    return 'cool';
  };

  if (loading) {
    return (
      <div className="weather-container">
        <div className="loading">Loading weather data...</div>
      </div>
    );
  }

  return (
    <div className="weather-container">
      {/* Header */}
      <div className="weather-header">
        <h1>🌤️ Weather Prediction for Agriculture</h1>
        <p>Get accurate weather forecasts and farming recommendations</p>
      </div>

      {/* Location Selector */}
      <div className="location-selector">
        <div className="card">
          <h2>Select Location</h2>
          <div className="selector-wrapper">
            <select 
              value={selectedLocation} 
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="location-select"
            >
              {locations.map(location => (
                <option key={location.value} value={location.value}>
                  {location.label}
                </option>
              ))}
            </select>
            <button onClick={fetchWeatherData} className="btn btn-primary">
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {weatherData && (
        <>
          {/* Current Weather */}
          <div className="current-weather">
            <div className="card">
              <h2>Current Weather - {weatherData.location}</h2>
              <div className="current-weather-content">
                <div className="weather-main">
                  <div className="weather-icon-large">
                    {getWeatherIcon(weatherData.current.condition)}
                  </div>
                  <div className="weather-info">
                    <div className="temperature">
                      <span className={`temp-max ${getTemperatureColor(weatherData.current.temperature.max)}`}>
                        {weatherData.current.temperature.max}°C
                      </span>
                      <span className="temp-separator">/</span>
                      <span className="temp-min">{weatherData.current.temperature.min}°C</span>
                    </div>
                    <div className="condition">{weatherData.current.condition}</div>
                    <div className="date">{weatherData.current.date}</div>
                  </div>
                </div>
                
                <div className="weather-details">
                  <div className="detail-item">
                    <span className="detail-icon">💧</span>
                    <span className="detail-label">Humidity</span>
                    <span className="detail-value">{weatherData.current.humidity}%</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">🌧️</span>
                    <span className="detail-label">Rainfall</span>
                    <span className="detail-value">{weatherData.current.rainfall}mm</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">💨</span>
                    <span className="detail-label">Wind Speed</span>
                    <span className="detail-value">{weatherData.current.windSpeed} km/h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div className="forecast-section">
            <div className="card">
              <h2>7-Day Forecast</h2>
              <div className="forecast-grid">
                {weatherData.forecast.map((day, index) => (
                  <div key={index} className={`forecast-item ${index === 0 ? 'today' : ''}`}>
                    <div className="forecast-day">
                      {index === 0 ? 'Today' : day.day}
                    </div>
                    <div className="forecast-icon">
                      {getWeatherIcon(day.condition)}
                    </div>
                    <div className="forecast-temps">
                      <span className="forecast-max">{day.temperature.max}°</span>
                      <span className="forecast-min">{day.temperature.min}°</span>
                    </div>
                    <div className="forecast-condition">{day.condition}</div>
                    <div className="forecast-rain">🌧️ {day.rainfall}mm</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Farming Advice */}
          <div className="farming-advice">
            <div className="card">
              <h2>🌾 Farming Recommendations</h2>
              <div className="advice-list">
                {weatherData.farmingAdvice.map((advice, index) => (
                  <div key={index} className="advice-item">
                    <span className="advice-text">{advice}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weather Impact on Crops */}
          <div className="crop-impact">
            <div className="card">
              <h2>🌱 Weather Impact on Crops</h2>
              <div className="impact-grid">
                <div className="impact-item">
                  <h3>🌾 Wheat</h3>
                  <p>Current conditions are {weatherData.current.temperature.max > 30 ? 'challenging' : 'favorable'} for wheat growth. 
                     {weatherData.current.rainfall > 10 ? ' Excess moisture may cause fungal issues.' : ' Monitor irrigation needs.'}</p>
                </div>
                <div className="impact-item">
                  <h3>🌾 Rice</h3>
                  <p>Rice crops {weatherData.current.rainfall > 15 ? 'benefit from current rainfall' : 'need additional irrigation'}. 
                     Temperature is {weatherData.current.temperature.max > 35 ? 'too high' : 'suitable'} for optimal growth.</p>
                </div>
                <div className="impact-item">
                  <h3>🌿 Cotton</h3>
                  <p>Cotton plants are {weatherData.current.humidity > 70 ? 'at risk of pest issues due to high humidity' : 'in good conditions'}. 
                     {weatherData.current.windSpeed > 15 ? ' Strong winds may affect flowering.' : ''}</p>
                </div>
                <div className="impact-item">
                  <h3>🌽 Maize</h3>
                  <p>Maize growth is {weatherData.current.temperature.max < 35 && weatherData.current.rainfall < 20 ? 'optimal' : 'stressed'} 
                     under current conditions. {weatherData.current.rainfall > 20 ? 'Ensure proper drainage.' : ''}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherPrediction;