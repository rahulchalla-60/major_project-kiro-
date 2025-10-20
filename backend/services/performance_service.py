"""
Performance analysis service for crop market analysis.
Handles top performers, bottom performers, and market analysis calculations.
"""

import numpy as np
from datetime import datetime
from .forecast_service import ForecastService

class PerformanceService:
    """
    Service class for analyzing crop performance and market trends.
    """
    
    def __init__(self, forecast_service=None):
        """
        Initialize the performance service.
        
        Args:
            forecast_service (ForecastService): Forecast service instance
        """
        self.forecast_service = forecast_service or ForecastService()
    
    def get_top_performers(self, current_month=None, forecast_months=6, top_n=5):
        """
        Get top N performing crops based on predicted price growth.
        
        Args:
            current_month (int): Current month (1-12)
            forecast_months (int): Number of months to forecast
            top_n (int): Number of top performers to return
            
        Returns:
            list: Top performing crops with growth metrics
        """
        if current_month is None:
            current_month = datetime.now().month
        
        performance_data = self._calculate_all_performance_metrics(current_month, forecast_months)
        
        # Sort by total growth percentage (descending)
        performance_data.sort(key=lambda x: x['total_growth_percent'], reverse=True)
        
        return performance_data[:top_n]
    
    def get_bottom_performers(self, current_month=None, forecast_months=6, bottom_n=5):
        """
        Get bottom N performing crops based on predicted price growth.
        
        Args:
            current_month (int): Current month (1-12)
            forecast_months (int): Number of months to forecast
            bottom_n (int): Number of bottom performers to return
            
        Returns:
            list: Bottom performing crops with growth metrics
        """
        if current_month is None:
            current_month = datetime.now().month
        
        performance_data = self._calculate_all_performance_metrics(current_month, forecast_months, include_risk=True)
        
        # Sort by total growth percentage (ascending for bottom performers)
        performance_data.sort(key=lambda x: x['total_growth_percent'])
        
        return performance_data[:bottom_n]
    
    def get_market_analysis(self, current_month=None, forecast_months=6):
        """
        Get comprehensive market analysis including top and bottom performers.
        
        Args:
            current_month (int): Current month (1-12)
            forecast_months (int): Number of months to forecast
            
        Returns:
            dict: Complete market analysis
        """
        if current_month is None:
            current_month = datetime.now().month
        
        # Get all performance data
        all_forecasts = self.forecast_service.get_all_crops_forecast(current_month, forecast_months)
        
        if not all_forecasts:
            return {"error": "Could not generate market analysis"}
        
        # Calculate market statistics
        market_stats = self._calculate_market_statistics(all_forecasts)
        
        return {
            "market_overview": market_stats,
            "top_performers": self.get_top_performers(current_month, forecast_months, 5),
            "bottom_performers": self.get_bottom_performers(current_month, forecast_months, 5),
            "analysis_period": {
                "current_month": current_month,
                "forecast_months": forecast_months,
                "analysis_date": datetime.now().isoformat()
            }
        }
    
    def _calculate_all_performance_metrics(self, current_month, forecast_months, include_risk=False):
        """
        Calculate performance metrics for all available crops.
        
        Args:
            current_month (int): Current month
            forecast_months (int): Number of forecast months
            include_risk (bool): Whether to include risk metrics
            
        Returns:
            list: Performance data for all crops
        """
        performance_data = []
        available_crops = self.forecast_service.data_loader.get_available_crops()
        
        for crop in available_crops:
            try:
                # Get current price and predictions
                crop_info = self.forecast_service.get_crop_info(crop)
                if not crop_info:
                    continue
                
                current_price = crop_info['latest_price']
                df = self.forecast_service.data_loader.get_crop_data(crop)
                predictions = self.forecast_service.price_predictor.predict_future_prices(
                    df, current_month, forecast_months
                )
                
                if not predictions:
                    continue
                
                # Calculate growth metrics
                growth_metrics = self.forecast_service.price_predictor.calculate_growth_metrics(
                    current_price, predictions, forecast_months
                )
                
                # Build performance data
                perf_data = {
                    "crop_name": crop.title(),
                    "current_price": round(current_price, 2),
                    "predicted_final_price": round(predictions[-1], 2),
                    "forecast_months": forecast_months,
                    "predicted_prices": [round(p, 2) for p in predictions],
                    **growth_metrics
                }
                
                # Add risk score for bottom performers
                if include_risk:
                    risk_score = growth_metrics['price_volatility'] / current_price * 100 if current_price > 0 else 0
                    perf_data["risk_score"] = round(risk_score, 2)
                
                performance_data.append(perf_data)
                
            except Exception as e:
                print(f"Error calculating performance for {crop}: {str(e)}")
                continue
        
        return performance_data
    
    def _calculate_market_statistics(self, all_forecasts):
        """
        Calculate overall market statistics from all forecasts.
        
        Args:
            all_forecasts (list): List of all crop forecasts
            
        Returns:
            dict: Market statistics
        """
        all_growth_rates = []
        
        for forecast in all_forecasts:
            if 'crop_info' in forecast and forecast['crop_info']:
                current_price = forecast['crop_info']['latest_price']
                final_price = forecast['predicted_prices'][-1]
                growth_rate = ((final_price - current_price) / current_price) * 100
                all_growth_rates.append(growth_rate)
        
        return {
            "average_growth": round(np.mean(all_growth_rates), 2) if all_growth_rates else 0,
            "market_volatility": round(np.std(all_growth_rates), 2) if all_growth_rates else 0,
            "positive_growth_crops": len([g for g in all_growth_rates if g > 0]),
            "negative_growth_crops": len([g for g in all_growth_rates if g < 0]),
            "total_crops_analyzed": len(all_growth_rates)
        }