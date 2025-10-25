"""
Simplified crop price forecasting module.
This module serves as the main interface for crop price prediction,
using modular components for better maintainability.
"""

from services.forecast_service import ForecastService
from services.performance_service import PerformanceService

# Initialize services
forecast_service = ForecastService()
performance_service = PerformanceService(forecast_service)

# Legacy compatibility - maintain the same interface
forecaster = forecast_service.data_loader

def get_forecast_for_crop(crop_name, current_month=None, forecast_months=6):
    """
    Get price forecast for a specific crop.
    
    Args:
        crop_name (str): Name of the crop
        current_month (int): Current month (1-12), defaults to current month
        forecast_months (int): Number of months to forecast (6-12)
        
    Returns:
        dict: Forecast results
    """
    return forecast_service.get_forecast_for_crop(crop_name, current_month, forecast_months)

def get_all_crops_forecast(current_month=None, forecast_months=6):
    """
    Get price forecasts for all available crops.
    
    Args:
        current_month (int): Current month (1-12)
        forecast_months (int): Number of months to forecast
        
    Returns:
        list: List of forecast results for all crops
    """
    return forecast_service.get_all_crops_forecast(current_month, forecast_months)

def get_available_crops():
    """
    Get list of all available crops.
    
    Returns:
        list: List of available crop names
    """
    return forecast_service.get_available_crops()

def get_top_performers(current_month=None, forecast_months=6, top_n=5):
    """
    Get top N performing crops based on predicted price growth.
    
    Args:
        current_month (int): Current month (1-12)
        forecast_months (int): Number of months to forecast
        top_n (int): Number of top performers to return
        
    Returns:
        list: Top performing crops with growth metrics
    """
    return performance_service.get_top_performers(current_month, forecast_months, top_n)

def get_bottom_performers(current_month=None, forecast_months=6, bottom_n=5):
    """
    Get bottom N performing crops based on predicted price growth.
    
    Args:
        current_month (int): Current month (1-12)
        forecast_months (int): Number of months to forecast
        bottom_n (int): Number of bottom performers to return
        
    Returns:
        list: Bottom performing crops with growth metrics
    """
    return performance_service.get_bottom_performers(current_month, forecast_months, bottom_n)

def get_market_analysis(current_month=None, forecast_months=6):
    """
    Get comprehensive market analysis including top and bottom performers.
    
    Args:
        current_month (int): Current month (1-12)
        forecast_months (int): Number of months to forecast
        
    Returns:
        dict: Complete market analysis
    """
    return performance_service.get_market_analysis(current_month, forecast_months)