import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import CropCard from "../components/CropCard";
import ForecastChart from "../components/ForecastChart";
import MarketAnalysis from "../components/MarketAnalysis";
import "./Home.css";

const Home = () => {
  const [selectedCrop, setSelectedCrop] = useState("wheat");
  const [cropData, setCropData] = useState(null);
  const [availableCrops, setAvailableCrops] = useState([]);
  const [marketAnalysis, setMarketAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredCrops, setFilteredCrops] = useState([]);

  const dropdownRef = useRef(null);

  const API_BASE_URL = "http://127.0.0.1:8001";

  useEffect(() => {
    fetchAvailableCrops();
    fetchMarketAnalysis();
  }, []);

  useEffect(() => {
    if (selectedCrop) {
      fetchCropData(selectedCrop);
    }
  }, [selectedCrop]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchAvailableCrops = async () => {
    try {
      console.log("Fetching available crops...");
      const response = await axios.get(`${API_BASE_URL}/crops`);
      console.log("Crops response:", response.data);

      const crops = response.data.available_crops || response.data || [];
      setAvailableCrops(crops);
      console.log("Available crops set:", crops);
    } catch (err) {
      console.error("Error fetching crops:", err);
      setError(
        "Failed to load available crops. Please check if the backend is running on port 8001."
      );
      // Set some default crops as fallback
      setAvailableCrops(["wheat", "rice", "cotton", "maize", "paddy"]);
    }
  };

  const fetchCropData = async (cropName) => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Fetching data for crop: ${cropName}`);

      const [forecastResponse, infoResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/predict/${cropName}?forecast_months=12`),
        axios.get(`${API_BASE_URL}/crop-info/${cropName}`),
      ]);

      console.log("Forecast response:", forecastResponse.data);
      console.log("Info response:", infoResponse.data);

      // Validate the response data
      if (!forecastResponse.data || !infoResponse.data) {
        throw new Error("Invalid response data structure");
      }

      setCropData({
        forecast: forecastResponse.data,
        info: infoResponse.data,
      });

      console.log("Crop data set successfully");
    } catch (err) {
      console.error("Error fetching crop data:", err);
      if (err.response) {
        // Server responded with error status
        setError(
          `Server error (${err.response.status}): ${
            err.response.data?.detail || "Unknown error"
          }`
        );
      } else if (err.request) {
        // Request was made but no response received
        setError(
          "No response from server. Please check if the backend is running on port 8001."
        );
      } else {
        // Something else happened
        setError(`Failed to load data for ${cropName}: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMarketAnalysis = async () => {
    try {
      console.log("Fetching market analysis...");
      const response = await axios.get(
        `${API_BASE_URL}/market-analysis?forecast_months=6`
      );
      console.log("Market analysis response:", response.data);
      setMarketAnalysis(response.data);
    } catch (err) {
      console.error("Error fetching market analysis:", err);
      // Don't set error for market analysis as it's not critical
    }
  };

  const filterCrops = (searchTerm) => {
    // Ensure we only filter from actual crop names, not any other data
    const validCrops = availableCrops.filter(
      (crop) => typeof crop === "string" && crop.trim().length > 0
    );
    const filtered = validCrops.filter((crop) =>
      crop.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCrops(filtered);
  };

  const handleCropChange = (event) => {
    const value = event.target.value;
    setSelectedCrop(value);
    setError(null);
    filterCrops(value);
  };

  const handleInputClick = () => {
    setIsDropdownOpen(true);
    // Ensure we always use the actual crops from availableCrops
    setFilteredCrops([...availableCrops]);
  };

  const handleCropSelect = (cropName) => {
    setSelectedCrop(cropName);
    setIsDropdownOpen(false);
    setError(null);
  };

  const handleClickOutside = (event) => {
    if (!dropdownRef.current?.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  if (loading && !cropData) {
    return (
      <div className="home-container">
        <div className="loading">Loading crop data...</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Header Section */}
      <div className="hero-section">
        <h1 className="hero-title">🌾 Crop Price Prediction Dashboard</h1>
        <p className="hero-subtitle">
          Get accurate price forecasts and market insights for agricultural
          commodities
        </p>
      </div>

      {/* Crop Selection */}
      <div className="crop-selector-section">
        <div className="card">
          <h2 className="card-title">Select Crop for Analysis</h2>
          <div className="selector-container">
            <div className="searchable-select" ref={dropdownRef}>
              <input
                type="text"
                value={selectedCrop}
                onChange={handleCropChange}
                onClick={handleInputClick}
                placeholder="Click to select or type to search crops..."
                className="crop-search-input"
              />
              <div className="search-icon">🔍</div>
              {isDropdownOpen && (
                <>
                  <div
                    className="dropdown-backdrop"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="crops-dropdown">
                    {filteredCrops.length > 0 ? (
                      <div className="crops-list">
                        {filteredCrops.map((crop) => (
                          <div
                            key={crop}
                            className="crop-option"
                            onClick={() => handleCropSelect(crop)}
                          >
                            {crop}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-crops-message">No crops found</div>
                    )}
                  </div>
                </>
              )}
            </div>
            <button
              onClick={() => fetchCropData(selectedCrop)}
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Loading..." : "Analyze"}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
        </div>
      )}

      {/* Navigation Tabs */}
      {cropData && (
        <div className="tabs-container">
          <div className="tabs-nav">
            <button
              className={`tab-button ${
                activeTab === "overview" ? "active" : ""
              }`}
              onClick={() => setActiveTab("overview")}
            >
              📊 Overview
            </button>
            <button
              className={`tab-button ${activeTab === "chart" ? "active" : ""}`}
              onClick={() => setActiveTab("chart")}
            >
              📈 Price Chart
            </button>
            <button
              className={`tab-button ${
                activeTab === "forecast" ? "active" : ""
              }`}
              onClick={() => setActiveTab("forecast")}
            >
              📋 Detailed Forecast
            </button>
            <button
              className={`tab-button ${activeTab === "top5" ? "active" : ""}`}
              onClick={() => setActiveTab("top5")}
            >
              🏆 Top 5 Performers
            </button>
            <button
              className={`tab-button ${
                activeTab === "bottom5" ? "active" : ""
              }`}
              onClick={() => setActiveTab("bottom5")}
            >
              📉 Bottom 5 Performers
            </button>
            <button
              className={`tab-button ${activeTab === "market" ? "active" : ""}`}
              onClick={() => setActiveTab("market")}
            >
              🌍 Market Analysis
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "overview" && (
              <div className="tab-panel">
                <CropCard
                  cropName={selectedCrop}
                  cropInfo={cropData.info}
                  forecast={cropData.forecast}
                />
              </div>
            )}

            {activeTab === "chart" && (
              <div className="tab-panel">
                <div className="card">
                  <h3 className="card-title">12-Month Price Forecast Chart</h3>
                  <ForecastChart
                    cropName={selectedCrop}
                    forecastData={cropData.forecast}
                  />
                </div>
              </div>
            )}

            {activeTab === "forecast" && (
              <div className="tab-panel">
                <div className="card">
                  <h3 className="card-title">Detailed Monthly Forecast</h3>
                  <div className="table-container">
                    <table className="forecast-table">
                      <thead>
                        <tr>
                          <th>Month</th>
                          <th>Predicted Price (₹/qtl)</th>
                          <th>Change from Current</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cropData.forecast.predicted_prices?.map(
                          (price, index) => {
                            const currentPrice = cropData.info.latest_price;
                            const change = (
                              ((price - currentPrice) / currentPrice) *
                              100
                            ).toFixed(2);
                            const monthNames = [
                              "Jan",
                              "Feb",
                              "Mar",
                              "Apr",
                              "May",
                              "Jun",
                              "Jul",
                              "Aug",
                              "Sep",
                              "Oct",
                              "Nov",
                              "Dec",
                            ];
                            const currentMonth =
                              cropData.forecast.current_month || 1;
                            const targetMonth = (currentMonth + index) % 12;

                            return (
                              <tr key={index}>
                                <td>
                                  {monthNames[targetMonth]}{" "}
                                  {new Date().getFullYear() +
                                    (currentMonth + index > 12 ? 1 : 0)}
                                </td>
                                <td>₹{price.toFixed(2)}</td>
                                <td
                                  className={
                                    change >= 0
                                      ? "status-positive"
                                      : "status-negative"
                                  }
                                >
                                  {change >= 0 ? "+" : ""}
                                  {change}%
                                  <span className="status-icon">
                                    {change >= 0 ? "📈" : "📉"}
                                  </span>
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "top5" && (
              <div className="tab-panel">
                <div className="card">
                  <h3 className="card-title">🏆 Top 5 Performing Crops</h3>
                  {marketAnalysis?.top_performers ? (
                    <div className="performers-grid">
                      {marketAnalysis.top_performers.map((crop, index) => {
                        console.log("Top performer crop data:", crop);
                        return (
                          <div
                            key={index}
                            className="performer-card top-performer"
                          >
                            <div className="performer-rank">#{index + 1}</div>
                            <div className="performer-info">
                              <h4>{crop.crop_name}</h4>
                              <div className="performer-growth status-positive">
                                +
                                {crop.total_growth_percent
                                  ? crop.total_growth_percent.toFixed(2)
                                  : "0.00"}
                                %
                              </div>
                              <div className="performer-price">
                                Current: ₹{crop.current_price?.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p>Loading top performers...</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "bottom5" && (
              <div className="tab-panel">
                <div className="card">
                  <h3 className="card-title">📉 Bottom 5 Performing Crops</h3>
                  {marketAnalysis?.bottom_performers ? (
                    <div className="performers-grid">
                      {marketAnalysis.bottom_performers.map((crop, index) => (
                        <div
                          key={index}
                          className="performer-card bottom-performer"
                        >
                          <div className="performer-rank">#{index + 1}</div>
                          <div className="performer-info">
                            <h4>{crop.crop_name}</h4>
                            <div className="performer-growth status-negative">
                              {crop.total_growth_percent
                                ? crop.total_growth_percent.toFixed(2)
                                : "0.00"}
                              %
                            </div>
                            <div className="performer-price">
                              Current: ₹{crop.current_price?.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Loading bottom performers...</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "market" && (
              <div className="tab-panel">
                {marketAnalysis ? (
                  <MarketAnalysis data={marketAnalysis} />
                ) : (
                  <div className="card">
                    <h3 className="card-title">Market Analysis</h3>
                    <p>Loading market analysis...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Market Analysis Section */}
      {marketAnalysis && (
        <div className="market-analysis-section">
          <MarketAnalysis data={marketAnalysis} />
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <div className="card">
          <h3 className="card-title">Quick Actions</h3>
          <div className="action-buttons">
            <button
              onClick={() => fetchMarketAnalysis()}
              className="btn btn-primary"
            >
              🔄 Refresh Market Data
            </button>
            <button
              onClick={() => window.open(`${API_BASE_URL}/docs`, "_blank")}
              className="btn btn-secondary"
            >
              📊 API Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
