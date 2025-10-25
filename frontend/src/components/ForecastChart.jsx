import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './ForecastChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ForecastChart = ({ cropName, forecastData }) => {
  if (!forecastData || !forecastData.predicted_prices) {
    return (
      <div className="chart-container">
        <div className="loading">Loading chart data...</div>
      </div>
    );
  }

  // Generate month labels
  const generateMonthLabels = (startMonth, count) => {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const labels = [];
    const currentYear = new Date().getFullYear();
    
    for (let i = 0; i < count; i++) {
      const monthIndex = (startMonth - 1 + i) % 12;
      const year = currentYear + Math.floor((startMonth - 1 + i) / 12);
      labels.push(`${monthNames[monthIndex]} ${year}`);
    }
    
    return labels;
  };

  const currentMonth = forecastData.current_month || new Date().getMonth() + 1;
  const labels = generateMonthLabels(currentMonth, forecastData.predicted_prices.length);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: `${cropName.charAt(0).toUpperCase() + cropName.slice(1)} Price Forecast`,
        data: forecastData.predicted_prices,
        borderColor: 'rgb(102, 126, 234)',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(102, 126, 234)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: 'rgb(102, 126, 234)',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 3,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 14,
            weight: '500'
          }
        }
      },
      title: {
        display: true,
        text: `Price Forecast - ${cropName.charAt(0).toUpperCase() + cropName.slice(1)}`,
        font: {
          size: 16,
          weight: '600'
        },
        padding: {
          top: 10,
          bottom: 30
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgb(102, 126, 234)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `Price: ₹${context.parsed.y.toFixed(2)} per qtl`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Month',
          font: {
            size: 14,
            weight: '500'
          }
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          maxRotation: 45,
          minRotation: 0,
          font: {
            size: 12
          }
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Price (₹ per qtl)',
          font: {
            size: 14,
            weight: '500'
          }
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value) {
            return '₹' + value.toFixed(0);
          },
          font: {
            size: 12
          }
        }
      }
    },
    elements: {
      point: {
        hoverRadius: 8
      }
    }
  };

  return (
    <div className="chart-container">
      <div className="chart-wrapper">
        <Line data={chartData} options={options} />
      </div>
      
      {/* Chart Statistics */}
      <div className="chart-stats">
        <div className="stat-item">
          <span className="stat-label">Current Price:</span>
          <span className="stat-value">₹{forecastData.crop_info?.latest_price?.toFixed(2) || 'N/A'}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Forecast Period:</span>
          <span className="stat-value">{forecastData.forecast_months} months</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Min Predicted:</span>
          <span className="stat-value">₹{Math.min(...forecastData.predicted_prices).toFixed(2)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Max Predicted:</span>
          <span className="stat-value">₹{Math.max(...forecastData.predicted_prices).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default ForecastChart;