"""
Feature engineering module for crop price prediction.
Handles creation of lag features, seasonal patterns, and other ML features.
"""

import pandas as pd
import numpy as np
from datetime import datetime

class FeatureEngineer:
    """
    Handles feature engineering for crop price prediction models.
    """
    
    @staticmethod
    def prepare_features(df, forecast_months=6):
        """
        Prepare features for machine learning model.
        
        Args:
            df (DataFrame): Crop data
            forecast_months (int): Number of months to forecast
            
        Returns:
            tuple: Features (X) and target (y) arrays, processed dataframe
        """
        # Create lag features (previous months' data)
        df_features = df.copy()
        
        # Add lag features for WPI (previous 1, 2, 3 months)
        for lag in range(1, 4):
            df_features[f'WPI_lag_{lag}'] = df_features['WPI'].shift(lag)
        
        # Add lag features for Rainfall
        for lag in range(1, 4):
            df_features[f'Rainfall_lag_{lag}'] = df_features['Rainfall'].shift(lag)
        
        # Add seasonal features
        df_features['Month_sin'] = np.sin(2 * np.pi * df_features['Month'] / 12)
        df_features['Month_cos'] = np.cos(2 * np.pi * df_features['Month'] / 12)
        
        # Add trend feature
        df_features['Trend'] = range(len(df_features))
        
        # Add moving averages
        df_features['WPI_MA_3'] = df_features['WPI'].rolling(window=3).mean()
        df_features['WPI_MA_6'] = df_features['WPI'].rolling(window=6).mean()
        df_features['Rainfall_MA_3'] = df_features['Rainfall'].rolling(window=3).mean()
        
        # Drop rows with NaN values (due to lag features)
        df_features = df_features.dropna()
        
        # Select feature columns
        feature_cols = [
            'Month', 'Rainfall', 'WPI_lag_1', 'WPI_lag_2', 'WPI_lag_3',
            'Rainfall_lag_1', 'Rainfall_lag_2', 'Rainfall_lag_3',
            'Month_sin', 'Month_cos', 'Trend', 'WPI_MA_3', 'WPI_MA_6', 'Rainfall_MA_3'
        ]
        
        X = df_features[feature_cols].values
        y = df_features['WPI'].values
        
        return X, y, df_features
    
    @staticmethod
    def calculate_seasonal_patterns(df):
        """
        Calculate seasonal patterns for each month.
        
        Args:
            df (DataFrame): Historical crop data
            
        Returns:
            dict: Seasonal adjustment factors for each month
        """
        monthly_patterns = {}
        for month in range(1, 13):
            month_data = df[df['Month'] == month]['WPI']
            if len(month_data) > 0:
                monthly_patterns[month] = month_data.mean()
            else:
                monthly_patterns[month] = df['WPI'].mean()
        
        # Calculate seasonal adjustment factors
        overall_mean = df['WPI'].mean()
        seasonal_factors = {month: price/overall_mean for month, price in monthly_patterns.items()}
        
        return seasonal_factors
    
    @staticmethod
    def calculate_price_trend(df, months=6):
        """
        Calculate price trend from recent data.
        
        Args:
            df (DataFrame): Historical crop data
            months (int): Number of recent months to consider
            
        Returns:
            float: Price trend per month
        """
        recent_prices = df['WPI'].tail(12).values
        
        if len(recent_prices) >= months:
            trend = (recent_prices[-1] - recent_prices[-months]) / months
        else:
            trend = (recent_prices[-1] - recent_prices[0]) / len(recent_prices)
        
        return trend
    
    @staticmethod
    def calculate_price_volatility(df, factor=0.1):
        """
        Calculate price volatility for adding randomness to predictions.
        
        Args:
            df (DataFrame): Historical crop data
            factor (float): Volatility factor (0.1 = 10% of std deviation)
            
        Returns:
            float: Price volatility value
        """
        return df['WPI'].std() * factor
    
    @staticmethod
    def get_monthly_rainfall_average(df, target_month):
        """
        Get average rainfall for a specific month from historical data.
        
        Args:
            df (DataFrame): Historical crop data
            target_month (int): Target month (1-12)
            
        Returns:
            float: Average rainfall for the month
        """
        month_rainfall = df[df['Month'] == target_month]['Rainfall'].mean()
        if pd.isna(month_rainfall):
            month_rainfall = df['Rainfall'].mean()
        return month_rainfall