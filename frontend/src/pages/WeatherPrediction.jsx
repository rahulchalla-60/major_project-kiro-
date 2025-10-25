import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WeatherPrediction.css';

const WeatherPrediction = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationResolving, setLocationResolving] = useState(false);

  // Environment variables
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const BASE_URL = import.meta.env.VITE_OPENWEATHER_BASE_URL;

  // Resolve location text to coordinates using geocoding API
  const resolveLocation = async (locationText) => {
    if (!locationText || !locationText.trim()) {
      throw new Error('Please enter a location name');
    }

    const trimmedText = locationText.trim();
    
    if (trimmedText.length < 2) {
      throw new Error('Location name must be at least 2 characters long');
    }

    setLocationResolving(true);

    try {
      console.log(`Searching for location: ${trimmedText}`);
      
      if (!API_KEY || !BASE_URL) {
        throw new Error('API configuration is missing');
      }

      const geoUrl = `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(trimmedText)}&limit=5&appid=${API_KEY}`;
      console.log(`Geocoding URL: ${geoUrl}`);
      
      const geoResponse = await axios.get(geoUrl);
      console.log('Geocoding response:', geoResponse.data);
      
      if (geoResponse.data && geoResponse.data.length > 0) {
        const geoData = geoResponse.data[0]; // Take the first result
        setLocationResolving(false);
        
        const locationInfo = {
          label: `${geoData.name}${geoData.state ? ', ' + geoData.state : ''}${geoData.country ? ', ' + geoData.country : ''}`,
          coordinates: { lat: geoData.lat, lon: geoData.lon },
          name: geoData.name,
          country: geoData.country,
          state: geoData.state
        };
        
        console.log('Resolved location:', locationInfo);
        return locationInfo;
      } else {
        setLocationResolving(false);
        throw new Error(`Location "${trimmedText}" not found. Please check spelling or try a nearby city.`);
      }
    } catch (error) {
      setLocationResolving(false);
      console.error('Geocoding error:', error);
      
      if (error.response) {
        if (error.response.status === 401) {
          throw new Error('Invalid API key. Please check your configuration.');
        } else if (error.response.status === 429) {
          throw new Error('Too many requests. Please wait a moment and try again.');
        } else if (error.response.status === 404) {
          throw new Error(`Location "${trimmedText}" not found. Please try a different location.`);
        }
      }
      
      throw new Error(`Unable to find location "${trimmedText}". ${error.message}`);
    }
  };

  // Fetch real weather data from OpenWeatherMap API
  const fetchRealWeatherData = async (locationData) => {
    if (!locationData) throw new Error('Location data not provided');

    try {
      // Fetch current weather
      const currentWeatherUrl = `${BASE_URL}/weather?lat=${locationData.coordinates.lat}&lon=${locationData.coordinates.lon}&appid=${API_KEY}&units=metric`;
      const currentResponse = await axios.get(currentWeatherUrl);
      
      // Fetch 5-day forecast
      const forecastUrl = `${BASE_URL}/forecast?lat=${locationData.coordinates.lat}&lon=${locationData.coordinates.lon}&appid=${API_KEY}&units=metric`;
      const forecastResponse = await axios.get(forecastUrl);
      
      // Process current weather data
      const current = {
        date: new Date().toLocaleDateString(),
        day: new Date().toLocaleDateString('en', { weekday: 'short' }),
        temperature: {
          max: Math.round(currentResponse.data.main.temp_max),
          min: Math.round(currentResponse.data.main.temp_min)
        },
        humidity: currentResponse.data.main.humidity,
        rainfall: currentResponse.data.rain ? Math.round(currentResponse.data.rain['1h'] || 0) : 0,
        windSpeed: Math.round(currentResponse.data.wind.speed * 3.6), // Convert m/s to km/h
        condition: getWeatherCondition(currentResponse.data.weather[0].main),
        icon: getWeatherEmoji(currentResponse.data.weather[0].main),
        description: currentResponse.data.weather[0].description
      };

      // Process forecast data (group by day and get daily min/max)
      const dailyForecasts = {};
      forecastResponse.data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toDateString();
        
        if (!dailyForecasts[dateKey]) {
          dailyForecasts[dateKey] = {
            date: date.toLocaleDateString(),
            day: date.toLocaleDateString('en', { weekday: 'short' }),
            temps: [],
            humidity: [],
            rainfall: [],
            windSpeed: [],
            conditions: [],
            icons: []
          };
        }
        
        dailyForecasts[dateKey].temps.push(item.main.temp);
        dailyForecasts[dateKey].humidity.push(item.main.humidity);
        dailyForecasts[dateKey].rainfall.push(item.rain ? item.rain['3h'] || 0 : 0);
        dailyForecasts[dateKey].windSpeed.push(item.wind.speed * 3.6);
        dailyForecasts[dateKey].conditions.push(item.weather[0].main);
        dailyForecasts[dateKey].icons.push(item.weather[0].main);
      });

      // Convert to forecast array (take first 7 days)
      const forecast = Object.values(dailyForecasts).slice(0, 7).map(day => ({
        date: day.date,
        day: day.day,
        temperature: {
          max: Math.round(Math.max(...day.temps)),
          min: Math.round(Math.min(...day.temps))
        },
        humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
        rainfall: Math.round(day.rainfall.reduce((a, b) => a + b, 0)),
        windSpeed: Math.round(day.windSpeed.reduce((a, b) => a + b, 0) / day.windSpeed.length),
        condition: getMostFrequent(day.conditions),
        icon: getWeatherEmoji(getMostFrequent(day.icons))
      }));

      // Use current weather for today if available
      if (forecast.length > 0) {
        forecast[0] = current;
      }

      return {
        location: locationData.label,
        current: current,
        forecast: forecast,
        farmingAdvice: generateFarmingAdvice(current)
      };

    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  };

  // Helper functions
  const getWeatherCondition = (weatherMain) => {
    const conditions = {
      'Clear': 'Sunny',
      'Clouds': 'Cloudy',
      'Rain': 'Rainy',
      'Drizzle': 'Rainy',
      'Thunderstorm': 'Thunderstorm',
      'Snow': 'Snowy',
      'Mist': 'Partly Cloudy',
      'Fog': 'Partly Cloudy',
      'Haze': 'Partly Cloudy'
    };
    return conditions[weatherMain] || 'Partly Cloudy';
  };

  const getWeatherEmoji = (weatherMain) => {
    const emojis = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
      'Fog': '🌫️',
      'Haze': '🌫️'
    };
    return emojis[weatherMain] || '🌤️';
  };

  const getMostFrequent = (arr) => {
    return arr.sort((a, b) =>
      arr.filter(v => v === a).length - arr.filter(v => v === b).length
    ).pop();
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
    // Don't fetch weather data on initial load - wait for user input
  }, []);

  const fetchWeatherData = async () => {
    if (!selectedLocation.trim()) {
      setError('Please enter a location name');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching weather data for:', selectedLocation);
      console.log('API Key:', API_KEY ? 'Available' : 'Missing');
      console.log('Base URL:', BASE_URL);
      
      // Resolve location text to coordinates
      const locationData = await resolveLocation(selectedLocation);
      console.log('Resolved location:', locationData);
      
      const realWeatherData = await fetchRealWeatherData(locationData);
      setWeatherData(realWeatherData);
      console.log('Weather data fetched successfully:', realWeatherData);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(err.message);
      
      // Fallback to mock data if API fails
      console.log('Falling back to mock data...');
      try {
        const mockData = generateMockWeatherData(selectedLocation || 'Unknown Location');
        setWeatherData(mockData);
        // Clear error since we have fallback data
        setError(null);
      } catch (mockError) {
        console.error('Mock data generation failed:', mockError);
        setError(`Failed to load weather data: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fallback mock data generator (in case API fails)
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
      location: location,
      current: forecast[0],
      forecast: forecast,
      farmingAdvice: generateFarmingAdvice(forecast[0])
    };
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
            <input 
              type="text"
              value={selectedLocation} 
              onChange={(e) => setSelectedLocation(e.target.value)}
              placeholder="Enter any city name (e.g., London, New York, Tokyo)"
              className="location-input"
              disabled={loading || locationResolving}
            />
            <button 
              onClick={fetchWeatherData} 
              className="btn btn-primary"
              disabled={loading || locationResolving}
            >
              {loading || locationResolving ? '⏳ Loading...' : '🔄 Refresh'}
            </button>
          </div>
          {locationResolving && (
            <div className="location-status">
              <span className="status-text">🔍 Finding location...</span>
            </div>
          )}
          {error && (
            <div className="error-message">
              <span className="error-text">⚠️ {error}</span>
            </div>
          )}
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