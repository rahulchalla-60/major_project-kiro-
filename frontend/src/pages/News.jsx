import React, { useState, useEffect } from 'react';
import './News.css';

const News = () => {
  const [news, setNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    { value: 'all', label: 'All News', icon: '📰' },
    { value: 'market', label: 'Market Updates', icon: '📈' },
    { value: 'weather', label: 'Weather News', icon: '🌤️' },
    { value: 'technology', label: 'AgriTech', icon: '🚜' },
    { value: 'policy', label: 'Policy & Govt', icon: '🏛️' },
    { value: 'crops', label: 'Crop Reports', icon: '🌾' }
  ];

  // Mock news data generator
  const generateMockNews = () => {
    const newsItems = [
      {
        id: 1,
        title: "Wheat Prices Surge 15% Following Monsoon Delays",
        summary: "Delayed monsoon rains have caused wheat prices to increase significantly across major markets. Farmers are advised to monitor market conditions closely.",
        category: 'market',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
        readTime: '3 min read',
        image: '🌾',
        source: 'AgriMarket Today',
        trending: true
      },
      {
        id: 2,
        title: "New AI-Powered Crop Monitoring System Launched",
        summary: "Revolutionary technology uses satellite imagery and machine learning to help farmers optimize crop yields and detect diseases early.",
        category: 'technology',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        readTime: '5 min read',
        image: '🤖',
        source: 'TechFarm Weekly',
        trending: false
      },
      {
        id: 3,
        title: "Government Announces ₹50,000 Crore Agriculture Support Package",
        summary: "New policy initiative aims to support farmers with subsidies, insurance coverage, and infrastructure development across rural India.",
        category: 'policy',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
        readTime: '4 min read',
        image: '🏛️',
        source: 'Policy India',
        trending: true
      },
      {
        id: 4,
        title: "Cyclone Warning: Eastern Coast Farmers Advised to Take Precautions",
        summary: "Meteorological department issues cyclone warning for eastern coastal regions. Farmers urged to secure crops and livestock.",
        category: 'weather',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
        readTime: '2 min read',
        image: '🌪️',
        source: 'Weather Alert',
        trending: true
      },
      {
        id: 5,
        title: "Rice Export Prices Hit 6-Month High Amid Global Demand",
        summary: "International demand for Indian rice varieties pushes export prices to new highs, benefiting farmers in major rice-producing states.",
        category: 'market',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
        readTime: '3 min read',
        image: '🌾',
        source: 'Export Tribune',
        trending: false
      },
      {
        id: 6,
        title: "Organic Farming Adoption Increases by 40% This Year",
        summary: "Growing consumer demand for organic produce drives more farmers to adopt sustainable farming practices and organic certification.",
        category: 'crops',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
        readTime: '4 min read',
        image: '🌱',
        source: 'Organic India',
        trending: false
      },
      {
        id: 7,
        title: "Smart Irrigation Systems Reduce Water Usage by 30%",
        summary: "IoT-enabled irrigation technology helps farmers optimize water usage while maintaining crop productivity in water-scarce regions.",
        category: 'technology',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6),
        readTime: '5 min read',
        image: '💧',
        source: 'Smart Farm Tech',
        trending: false
      },
      {
        id: 8,
        title: "Cotton Farmers Report 25% Yield Increase with New Varieties",
        summary: "Genetically improved cotton varieties show significant yield improvements and better resistance to pests and diseases.",
        category: 'crops',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        readTime: '3 min read',
        image: '🌿',
        source: 'Cotton Weekly',
        trending: false
      }
    ];

    return newsItems;
  };

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const mockNews = generateMockNews();
      setNews(mockNews);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  const trendingNews = news.filter(item => item.trending);

  const formatDate = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="news-container">
        <div className="loading">Loading latest agricultural news...</div>
      </div>
    );
  }

  return (
    <div className="news-container">
      {/* Header */}
      <div className="news-header">
        <h1>📰 Agricultural News & Updates</h1>
        <p>Stay informed with the latest developments in agriculture, markets, and technology</p>
      </div>

      {/* Trending News */}
      {trendingNews.length > 0 && (
        <div className="trending-section">
          <h2 className="section-title">🔥 Trending Now</h2>
          <div className="trending-grid">
            {trendingNews.map(item => (
              <div key={item.id} className="trending-card">
                <div className="trending-badge">Trending</div>
                <div className="news-image">{item.image}</div>
                <div className="trending-content">
                  <h3 className="trending-title">{item.title}</h3>
                  <p className="trending-summary">{item.summary}</p>
                  <div className="trending-meta">
                    <span className="news-source">{item.source}</span>
                    <span className="news-date">{formatDate(item.date)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="category-filter">
        <h2 className="section-title">Browse by Category</h2>
        <div className="category-buttons">
          {categories.map(category => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`category-btn ${selectedCategory === category.value ? 'active' : ''}`}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-label">{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* News Grid */}
      <div className="news-grid">
        {filteredNews.map(item => (
          <article key={item.id} className="news-card">
            <div className="news-card-header">
              <div className="news-image-container">
                <div className="news-image">{item.image}</div>
                <div className="news-category">
                  {categories.find(cat => cat.value === item.category)?.icon} 
                  {categories.find(cat => cat.value === item.category)?.label}
                </div>
              </div>
            </div>
            
            <div className="news-card-content">
              <h3 className="news-title">{item.title}</h3>
              <p className="news-summary">{item.summary}</p>
              
              <div className="news-meta">
                <div className="meta-left">
                  <span className="news-source">{item.source}</span>
                  <span className="news-date">{formatDate(item.date)}</span>
                </div>
                <div className="meta-right">
                  <span className="read-time">{item.readTime}</span>
                </div>
              </div>
            </div>
            
            <div className="news-card-footer">
              <button className="read-more-btn">Read Full Article</button>
              <div className="news-actions">
                <button className="action-btn">📤 Share</button>
                <button className="action-btn">🔖 Save</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Load More */}
      <div className="load-more-section">
        <button className="btn btn-primary load-more-btn">
          Load More Articles
        </button>
      </div>

      {/* News Sources */}
      <div className="news-sources">
        <div className="card">
          <h3>📡 Our News Sources</h3>
          <div className="sources-grid">
            <div className="source-item">
              <span className="source-icon">📈</span>
              <span className="source-name">AgriMarket Today</span>
            </div>
            <div className="source-item">
              <span className="source-icon">🚜</span>
              <span className="source-name">TechFarm Weekly</span>
            </div>
            <div className="source-item">
              <span className="source-icon">🏛️</span>
              <span className="source-name">Policy India</span>
            </div>
            <div className="source-item">
              <span className="source-icon">🌤️</span>
              <span className="source-name">Weather Alert</span>
            </div>
            <div className="source-item">
              <span className="source-icon">🌾</span>
              <span className="source-name">Export Tribune</span>
            </div>
            <div className="source-item">
              <span className="source-icon">🌱</span>
              <span className="source-name">Organic India</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;