"""
FastAPI application for crop price prediction.
Provides endpoints for forecasting crop prices using machine learning models.
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import uvicorn
from datetime import datetime

# Import our forecasting functions
from forecast import (
    get_forecast_for_crop, 
    get_all_crops_forecast, 
    get_available_crops,
    forecaster
)

# Initialize FastAPI app
app = FastAPI(
    title="Crop Price Prediction API",
    description="API for predicting crop prices using machine learning models trained on historical data",
    version="1.0.0"
)

# Add CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """
    Root endpoint returning welcome message and API information.
    
    Returns:
        dict: Welcome message and available endpoints
    """
    return {
        "message": "Crop Price Prediction API running successfully",
        "version": "1.0.0",
        "available_endpoints": [
            "/crops - Get list of available crops",
            "/predict/{crop_name} - Predict prices for specific crop",
            "/forecast - Get forecasts for all crops",
            "/crop-info/{crop_name} - Get information about specific crop"
        ],
        "total_crops": len(get_available_crops())
    }

@app.get("/crops")
async def get_crops():
    """
    Get list of all available crops for prediction.
    
    Returns:
        dict: List of available crops
    """
    try:
        crops = get_available_crops()
        return {
            "available_crops": crops,
            "total_count": len(crops)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving crops: {str(e)}")

@app.get("/predict/{crop_name}")
async def predict_crop_price(
    crop_name: str,
    current_month: Optional[int] = Query(None, ge=1, le=12, description="Current month (1-12)"),
    forecast_months: Optional[int] = Query(6, ge=6, le=12, description="Number of months to forecast (6-12)")
):
    """
    Predict future prices for a specific crop.
    
    Args:
        crop_name (str): Name of the crop to predict
        current_month (int, optional): Current month (1-12). Defaults to current month.
        forecast_months (int, optional): Number of months to forecast (6-12). Defaults to 6.
    
    Returns:
        dict: Prediction results including forecasted prices
    """
    try:
        # Use current month if not provided
        if current_month is None:
            current_month = datetime.now().month
        
        # Get forecast for the specific crop
        result = get_forecast_for_crop(crop_name, current_month, forecast_months)
        
        if "error" in result:
            raise HTTPException(status_code=404, detail=result["error"])
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error predicting prices: {str(e)}")

@app.get("/forecast")
async def get_all_forecasts(
    current_month: Optional[int] = Query(None, ge=1, le=12, description="Current month (1-12)"),
    forecast_months: Optional[int] = Query(6, ge=6, le=12, description="Number of months to forecast (6-12)")
):
    """
    Get price forecasts for all available crops.
    
    Args:
        current_month (int, optional): Current month (1-12). Defaults to current month.
        forecast_months (int, optional): Number of months to forecast (6-12). Defaults to 6.
    
    Returns:
        dict: Forecasts for all crops
    """
    try:
        # Use current month if not provided
        if current_month is None:
            current_month = datetime.now().month
        
        # Get forecasts for all crops
        results = get_all_crops_forecast(current_month, forecast_months)
        
        return {
            "current_month": current_month,
            "forecast_months": forecast_months,
            "total_crops": len(results),
            "forecasts": results
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating forecasts: {str(e)}")

@app.get("/crop-info/{crop_name}")
async def get_crop_information(crop_name: str):
    """
    Get detailed information about a specific crop.
    
    Args:
        crop_name (str): Name of the crop
    
    Returns:
        dict: Crop information including historical data summary
    """
    try:
        crop_info = forecaster.get_crop_info(crop_name)
        
        if crop_info is None:
            raise HTTPException(status_code=404, detail=f"Crop '{crop_name}' not found")
        
        return crop_info
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving crop information: {str(e)}")

@app.get("/health")
async def health_check():
    """
    Health check endpoint to verify API status.
    
    Returns:
        dict: API health status
    """
    try:
        # Check if forecaster is working
        available_crops = len(get_available_crops())
        
        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "crops_loaded": available_crops,
            "models_trained": len(forecaster.models)
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

# Run the application
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )