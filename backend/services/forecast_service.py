"""
Forecast service module that orchestrates all forecasting operations.
Main service layer that coordinates data loading, model training, and predictions.
"""

from datetime import datetime
from ..models.data_loader import CropDataLoader
from ..models.ml_models import CropPriceMLModel
from ..models.price_predictor import CropPricePredictor

class ForecastService:
    """
    Main service class that orchestrates crop price forecasting operations.
    """
    
    def __init__(self, data_folder="static"):
        """
        Initialize the forecast service.
        
        Args:
            data_folder (str): Path to folder containing CSV files
        """
        self.data_loader = CropDataLoader(data_folder)
        self.ml_model = CropPriceMLModel()
        self.price_predictor = CropPricePredictor()
        
        # Load all crop data on initialization
        self.crop_data = self.data_loader.load_all_crop_data()
    
    def get_forecast_for_crop(self, crop_name, current_month=None, forecast_months=6):
        """
        Get price forecast for a specific crop.
        
        Args:
            crop_name (str): Name of the crop
            current_month (int): Current month (1-12), defaults to current month
            forecast_months (int): Number of months to forecast (6-12)
            
        Returns:
            dict: Forecast results
        """
        if current_month is None:
            current_month = datetime.now().month
        
        # Validate inputs
        if not (1 <= current_month <= 12):
            return {"error": "Current month must be between 1 and 12"}
        
        if not (6 <= forecast_months <= 12):
            return {"error": "Forecast months must be between 6 and 12"}
        
        # Get crop data
        df = self.data_loader.get_crop_data(crop_name)
        if df is None:
            return {"error": f"Could not find data for {crop_name}"}
        
        # Generate predictions
        predictions = self.price_predictor.predict_future_prices(df, current_month, forecast_months)
        
        if not predictions:
            return {"error": f"Could not generate forecast for {crop_name}"}
        
        # Get crop information
        crop_info = self.data_loader.get_crop_info(crop_name)
        
        return {
            "crop_name": crop_name.title(),
            "current_month": current_month,
            "forecast_months": forecast_months,
            "predicted_prices": [round(price, 2) for price in predictions],
            "crop_info": crop_info
        }
    
    def get_all_crops_forecast(self, current_month=None, forecast_months=6):
        """
        Get price forecasts for all available crops.
        
        Args:
            current_month (int): Current month (1-12)
            forecast_months (int): Number of months to forecast
            
        Returns:
            list: List of forecast results for all crops
        """
        if current_month is None:
            current_month = datetime.now().month
        
        results = []
        available_crops = self.data_loader.get_available_crops()
        
        for crop in available_crops:
            forecast = self.get_forecast_for_crop(crop, current_month, forecast_months)
            if "error" not in forecast:
                results.append(forecast)
        
        return results
    
    def get_available_crops(self):
        """
        Get list of all available crops.
        
        Returns:
            list: List of available crop names
        """
        return [crop.title() for crop in self.data_loader.get_available_crops()]
    
    def get_crop_info(self, crop_name):
        """
        Get information about a specific crop.
        
        Args:
            crop_name (str): Name of the crop
            
        Returns:
            dict: Crop information
        """
        return self.data_loader.get_crop_info(crop_name)