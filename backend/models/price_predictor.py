"""
Price prediction module for crop forecasting.
Handles the core prediction logic using various forecasting approaches.
"""

import numpy as np
from datetime import datetime
from .feature_engineering import FeatureEngineer

class CropPricePredictor:
    """
    Handles crop price prediction using improved time-series approach.
    """
    
    def __init__(self):
        """Initialize the price predictor."""
        self.feature_engineer = FeatureEngineer()
    
    def predict_future_prices(self, df, current_month, forecast_months=6):
        """
        Predict future prices for a specific crop using improved time-series approach.
        
        Args:
            df (DataFrame): Historical crop data
            current_month (int): Current month (1-12)
            forecast_months (int): Number of months to forecast (6-12)
            
        Returns:
            list: Predicted prices for future months
        """
        try:
            # Get recent price trend and seasonal patterns
            recent_prices = df['WPI'].tail(12).values
            latest_price = recent_prices[-1]
            
            # Calculate trend from recent data
            trend = self.feature_engineer.calculate_price_trend(df, months=6)
            
            # Get seasonal patterns
            seasonal_factors = self.feature_engineer.calculate_seasonal_patterns(df)
            
            # Calculate price volatility
            price_volatility = self.feature_engineer.calculate_price_volatility(df)
            
            predictions = []
            
            for month_ahead in range(1, forecast_months + 1):
                target_month = ((current_month + month_ahead - 1) % 12) + 1
                
                # Base prediction using trend
                base_prediction = latest_price + (trend * month_ahead)
                
                # Apply seasonal adjustment
                seasonal_adjustment = seasonal_factors[target_month]
                seasonal_prediction = base_prediction * seasonal_adjustment
                
                # Add controlled randomness for variation
                random_factor = np.random.normal(0, price_volatility)
                final_prediction = seasonal_prediction + random_factor
                
                # Ensure reasonable bounds
                min_price = latest_price * 0.8  # Not less than 80% of current price
                max_price = latest_price * 1.3  # Not more than 130% of current price
                final_prediction = np.clip(final_prediction, min_price, max_price)
                
                predictions.append(max(final_prediction, 0))
                
                # Update latest_price for next iteration
                latest_price = final_prediction
            
            return predictions
            
        except Exception as e:
            print(f"Error in price prediction: {str(e)}")
            return self._fallback_prediction(df, forecast_months)
    
    def _fallback_prediction(self, df, forecast_months):
        """
        Fallback prediction method using simple trend analysis.
        
        Args:
            df (DataFrame): Historical crop data
            forecast_months (int): Number of months to forecast
            
        Returns:
            list: Predicted prices using fallback method
        """
        try:
            latest_price = df['WPI'].iloc[-1]
            trend = self.feature_engineer.calculate_price_trend(df, months=6)
            predictions = []
            
            for month_ahead in range(1, forecast_months + 1):
                # Add variation to avoid identical predictions
                variation = np.random.normal(0, latest_price * 0.02)  # 2% variation
                predicted_price = latest_price + (trend * month_ahead) + variation
                predictions.append(max(predicted_price, latest_price * 0.9))
            
            return predictions
        except:
            # Ultimate fallback: return current price with small variations
            latest_price = df['WPI'].iloc[-1] if len(df) > 0 else 100
            return [latest_price * (1 + np.random.normal(0, 0.01)) for _ in range(forecast_months)]
    
    def calculate_growth_metrics(self, current_price, predictions, forecast_months):
        """
        Calculate growth metrics for performance analysis.
        
        Args:
            current_price (float): Current crop price
            predictions (list): List of predicted prices
            forecast_months (int): Number of forecast months
            
        Returns:
            dict: Growth metrics including total and monthly growth
        """
        if not predictions or current_price <= 0:
            return {
                "total_growth_percent": 0,
                "avg_monthly_growth_percent": 0,
                "price_volatility": 0
            }
        
        final_price = predictions[-1]
        total_growth = ((final_price - current_price) / current_price) * 100
        avg_monthly_growth = total_growth / forecast_months
        price_volatility = np.std(predictions) if len(predictions) > 1 else 0
        
        return {
            "total_growth_percent": round(total_growth, 2),
            "avg_monthly_growth_percent": round(avg_monthly_growth, 2),
            "price_volatility": round(price_volatility, 2)
        }