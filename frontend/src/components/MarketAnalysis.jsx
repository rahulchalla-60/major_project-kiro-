import React from 'react';
import './MarketAnalysis.css';

const MarketAnalysis = ({ data }) => {
  if (!data) {
    return (
      <div className="market-analysis">
        <div className="loading">Loading market analysis...</div>
      </div>
    );
  }

  const { market_overview, top_performers, bottom_performers } = data;

  const formatPercentage = (value) => {
    return value >= 0 ? `+${value.toFixed(2)}%` : `${value.toFixed(2)}%`;
  };

  const getPerformanceColor = (value) => {
    return value >= 0 ? 'positive' : 'negative';
  };

  return (
    <div className="market-analysis">
      <h2 className="analysis-title">📊 Market Analysis Dashboard</h2>
      
      {/* Market Overview */}
      <div className="market-overview-section">
        <h3 className="section-title">Market Overview</h3>
        <div className="overview-grid">
          <div className="overview-card">
            <div className="overview-icon">📈</div>
            <div className="overview-content">
              <div className="overview-label">Average Growth</div>
              <div className={`overview-value ${getPerformanceColor(market_overview.average_growth)}`}>
                {formatPercentage(market_overview.average_growth)}
              </div>
            </div>
          </div>
          
          <div className="overview-card">
            <div className="overview-icon">📊</div>
            <div className="overview-content">
              <div className="overview-label">Market Volatility</div>
              <div className="overview-value">
                {market_overview.market_volatility.toFixed(2)}%
              </div>
            </div>
          </div>
          
          <div className="overview-card">
            <div className="overview-icon">🟢</div>
            <div className="overview-content">
              <div className="overview-label">Positive Growth</div>
              <div className="overview-value positive">
                {market_overview.positive_growth_crops} crops
              </div>
            </div>
          </div>
          
          <div className="overview-card">
            <div className="overview-icon">🔴</div>
            <div className="overview-content">
              <div className="overview-label">Negative Growth</div>
              <div className="overview-value negative">
                {market_overview.negative_growth_crops} crops
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="performance-section">
        <div className="performance-grid">
          {/* Top Performers */}
          <div className="performance-card">
            <h3 className="performance-title">
              🏆 Top Performers
              <span className="performance-subtitle">Highest Expected Growth</span>
            </h3>
            <div className="performers-list">
              {top_performers?.slice(0, 5).map((crop, index) => (
                <div key={crop.crop_name} className="performer-item">
                  <div className="performer-rank">#{index + 1}</div>
                  <div className="performer-info">
                    <div className="performer-name">{crop.crop_name}</div>
                    <div className="performer-details">
                      <span className="current-price">₹{crop.current_price}</span>
                      <span className="arrow">→</span>
                      <span className="predicted-price">₹{crop.predicted_final_price}</span>
                    </div>
                  </div>
                  <div className={`performer-growth ${getPerformanceColor(crop.total_growth_percent)}`}>
                    {formatPercentage(crop.total_growth_percent)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Performers */}
          <div className="performance-card">
            <h3 className="performance-title">
              📉 Bottom Performers
              <span className="performance-subtitle">Lowest Expected Growth</span>
            </h3>
            <div className="performers-list">
              {bottom_performers?.slice(0, 5).map((crop, index) => (
                <div key={crop.crop_name} className="performer-item">
                  <div className="performer-rank bottom">#{index + 1}</div>
                  <div className="performer-info">
                    <div className="performer-name">{crop.crop_name}</div>
                    <div className="performer-details">
                      <span className="current-price">₹{crop.current_price}</span>
                      <span className="arrow">→</span>
                      <span className="predicted-price">₹{crop.predicted_final_price}</span>
                    </div>
                  </div>
                  <div className={`performer-growth ${getPerformanceColor(crop.total_growth_percent)}`}>
                    {formatPercentage(crop.total_growth_percent)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Period Info */}
      <div className="analysis-info">
        <div className="info-card">
          <h4>Analysis Details</h4>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Analysis Date:</span>
              <span className="info-value">
                {new Date(data.analysis_period?.analysis_date).toLocaleDateString()}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Forecast Period:</span>
              <span className="info-value">
                {data.analysis_period?.forecast_months} months
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Total Crops Analyzed:</span>
              <span className="info-value">
                {market_overview.total_crops_analyzed} crops
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketAnalysis;