"""
Machine learning models module for crop price prediction.
Handles model training, prediction, and evaluation.
"""

import numpy as np
from sklearn.tree import DecisionTreeRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from .feature_engineering import FeatureEngineer

class CropPriceMLModel:
    """
    Handles machine learning model training and prediction for crop prices.
    """
    
    def __init__(self):
        """Initialize the ML model handler."""
        self.models = {}
        self.scalers = {}
        self.feature_engineer = FeatureEngineer()
    
    def train_model(self, crop_name, df):
        """
        Train a Decision Tree model for a specific crop.
        
        Args:
            crop_name (str): Name of the crop
            df (DataFrame): Crop data
            
        Returns:
            bool: True if training successful, False otherwise
        """
        crop_name = crop_name.lower()
        
        try:
            X, y, _ = self.feature_engineer.prepare_features(df)
            
            if len(X) < 10:  # Need minimum data points
                print(f"Insufficient data for {crop_name}")
                return False
            
            # Split data for training
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            
            # Scale features
            scaler = StandardScaler()
            X_train_scaled = scaler.fit_transform(X_train)
            X_test_scaled = scaler.transform(X_test)
            
            # Train Decision Tree model
            model = DecisionTreeRegressor(
                max_depth=10,
                min_samples_split=5,
                min_samples_leaf=2,
                random_state=42
            )
            model.fit(X_train_scaled, y_train)
            
            # Store model and scaler
            self.models[crop_name] = model
            self.scalers[crop_name] = scaler
            
            # Calculate accuracy
            train_score = model.score(X_train_scaled, y_train)
            test_score = model.score(X_test_scaled, y_test)
            
            print(f"Model trained for {crop_name} - Train Score: {train_score:.3f}, Test Score: {test_score:.3f}")
            return True
            
        except Exception as e:
            print(f"Error training model for {crop_name}: {str(e)}")
            return False
    
    def has_trained_model(self, crop_name):
        """
        Check if a model is trained for the given crop.
        
        Args:
            crop_name (str): Name of the crop
            
        Returns:
            bool: True if model exists, False otherwise
        """
        return crop_name.lower() in self.models
    
    def get_model_info(self):
        """
        Get information about trained models.
        
        Returns:
            dict: Information about trained models
        """
        return {
            "total_models": len(self.models),
            "trained_crops": list(self.models.keys())
        }