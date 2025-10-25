import React from 'react';
import './CropCard.css';

const CropCard = ({ cropName, cropInfo, forecast }) => {
  if (!cropInfo || !forecast) {
    return (
      <div className="crop-card">
        <div className="loading">Loading crop information...</div>
      </div>
    );
  }

  // Calculate min and max prices from forecast
  const prices = forecast.predicted_prices || [];
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const currentPrice = cropInfo.latest_price;
  
  // Calculate growth percentage
  const finalPrice = prices[prices.length - 1] || currentPrice;
  const growthPercent = ((finalPrice - currentPrice) / currentPrice * 100).toFixed(2);

  // Get crop image (fallback to placeholder)
  const getCropImage = (crop) => {
    const cropImages = {
      wheat: '🌾',
      rice: '🌾',
      paddy: '🌾',
      corn: '🌽',
      maize: '🌽',
      cotton: '🌿',
      sugarcane: '🎋',
      soybean: '🫘',
      barley: '🌾',
      oats: '🌾'
    };
    return cropImages[crop.toLowerCase()] || '🌱';
  };

  return (
    <div className="crop-card">
      <div className="card-horizontal">
        {/* Crop Image Section */}
        <div className="crop-image-section">
          <div className="crop-image-placeholder">
            <span className="crop-emoji">{getCropImage(cropName)}</span>
          </div>
          <h2 className="crop-name">{cropInfo.crop_name}</h2>
        </div>

        {/* Crop Information */}
        <div className="crop-info-content">
          <h3 className="section-title">Current Market Information</h3>
          <table className="info-table">
            <tbody>
              <tr>
                <td>Current Price</td>
                <td><strong>₹{currentPrice.toFixed(2)} / qtl</strong></td>
              </tr>
              <tr>
                <td>Data Points</td>
                <td><strong>{cropInfo.data_points} records</strong></td>
              </tr>
              <tr>
                <td>Data Range</td>
                <td><strong>{cropInfo.date_range}</strong></td>
              </tr>
              <tr>
                <td>Price Range</td>
                <td><strong>₹{cropInfo.price_range}</strong></td>
              </tr>
              <tr>
                <td>Avg. Rainfall</td>
                <td><strong>{cropInfo.avg_rainfall.toFixed(1)} mm</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Forecast Summary */}
        <div className="forecast-summary">
          <h3 className="section-title">Forecast Summary</h3>
          <div className="summary-cards">
            <div className="summary-card">
              <div className="summary-label">Expected Growth</div>
              <div className={`summary-value ${growthPercent >= 0 ? 'positive' : 'negative'}`}>
                {growthPercent >= 0 ? '+' : ''}{growthPercent}%
              </div>
            </div>
            
            <div className="summary-card">
              <div className="summary-label">Min. Expected Price</div>
              <div className="summary-value">₹{minPrice.toFixed(2)}</div>
            </div>
            
            <div className="summary-card">
              <div className="summary-label">Max. Expected Price</div>
              <div className="summary-value">₹{maxPrice.toFixed(2)}</div>
            </div>
            
            <div className="summary-card">
              <div className="summary-label">Forecast Period</div>
              <div className="summary-value">{forecast.forecast_months} months</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropCard;