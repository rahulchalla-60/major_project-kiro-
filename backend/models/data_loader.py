"""
Data loading and preprocessing module for crop price prediction.
Handles CSV file loading, data cleaning, and validation.
"""

import pandas as pd
import numpy as np
import os
import glob
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

class CropDataLoader:
    """
    Handles loading and preprocessing of crop data from CSV files.
    """
    
    def __init__(self, data_folder="static"):
        """
        Initialize the data loader.
        
        Args:
            data_folder (str): Path to folder containing CSV files
        """
        self.data_folder = data_folder
        self.crop_data = {}
    
    def load_all_crop_data(self):
        """
        Load all CSV files from the static folder and store crop data.
        
        Returns:
            dict: Dictionary containing crop data for each crop
        """
        csv_files = glob.glob(os.path.join(self.data_folder, "*.csv"))
        
        for file_path in csv_files:
            crop_name = os.path.basename(file_path).replace('.csv', '')
            try:
                df = self._load_single_crop_data(file_path, crop_name)
                if df is not None:
                    self.crop_data[crop_name.lower()] = df
                    print(f"Loaded data for {crop_name}: {len(df)} records")
            except Exception as e:
                print(f"Error loading {crop_name}: {str(e)}")
        
        return self.crop_data
    
    def _load_single_crop_data(self, file_path, crop_name):
        """
        Load and validate data for a single crop.
        
        Args:
            file_path (str): Path to the CSV file
            crop_name (str): Name of the crop
            
        Returns:
            DataFrame or None: Processed crop data or None if invalid
        """
        df = pd.read_csv(file_path)
        
        # Clean column names (remove extra spaces)
        df.columns = df.columns.str.strip()
        
        # Ensure required columns exist
        required_columns = ['Month', 'Year', 'Rainfall', 'WPI']
        if not all(col in df.columns for col in required_columns):
            print(f"Skipping {crop_name}: Missing required columns")
            return None
        
        # Create date column for better time series handling
        df['Date'] = pd.to_datetime(df[['Year', 'Month']].assign(day=1))
        df = df.sort_values('Date')
        
        # Validate data quality
        if not self._validate_data_quality(df, crop_name):
            return None
        
        return df
    
    def _validate_data_quality(self, df, crop_name):
        """
        Validate the quality of loaded data.
        
        Args:
            df (DataFrame): Crop data to validate
            crop_name (str): Name of the crop
            
        Returns:
            bool: True if data is valid, False otherwise
        """
        # Check for minimum data points
        if len(df) < 10:
            print(f"Insufficient data for {crop_name}: only {len(df)} records")
            return False
        
        # Check for missing values in critical columns
        critical_columns = ['Month', 'Year', 'WPI']
        for col in critical_columns:
            if df[col].isnull().sum() > 0:
                print(f"Missing values in {col} for {crop_name}")
                return False
        
        # Check for reasonable value ranges
        if df['Month'].min() < 1 or df['Month'].max() > 12:
            print(f"Invalid month values for {crop_name}")
            return False
        
        if df['WPI'].min() <= 0:
            print(f"Invalid WPI values for {crop_name}")
            return False
        
        return True
    
    def get_crop_data(self, crop_name):
        """
        Get data for a specific crop.
        
        Args:
            crop_name (str): Name of the crop
            
        Returns:
            DataFrame or None: Crop data or None if not found
        """
        return self.crop_data.get(crop_name.lower())
    
    def get_available_crops(self):
        """
        Get list of available crops.
        
        Returns:
            list: List of available crop names
        """
        return list(self.crop_data.keys())
    
    def get_crop_info(self, crop_name):
        """
        Get information about a specific crop.
        
        Args:
            crop_name (str): Name of the crop
            
        Returns:
            dict: Crop information or None if not found
        """
        crop_name = crop_name.lower()
        
        if crop_name not in self.crop_data:
            return None
        
        df = self.crop_data[crop_name]
        
        return {
            "crop_name": crop_name.title(),
            "latest_price": float(df['WPI'].iloc[-1]),
            "data_points": len(df),
            "date_range": f"{df['Year'].min()}-{df['Year'].max()}",
            "price_range": f"{df['WPI'].min():.2f} - {df['WPI'].max():.2f}",
            "avg_rainfall": float(df['Rainfall'].mean())
        }