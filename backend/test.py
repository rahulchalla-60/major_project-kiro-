
"""
Test script for crop price prediction API
Tests the forecasting functionality directly without starting a server
"""

from forecast import get_forecast_for_crop, get_all_crops_forecast, get_available_crops

def test_prediction_system():
    """Test the prediction system functionality"""
    
    print("🌾 Testing Crop Price Prediction System")
    print("=" * 50)
    
    # Test 1: Get available crops
    print("\n1. Testing available crops...")
    try:
        crops = get_available_crops()
        print(f"✅ Found {len(crops)} crops: {crops[:5]}..." if len(crops) > 5 else f"✅ Found crops: {crops}")
    except Exception as e:
        print(f"❌ Error getting crops: {e}")
        return
    
    # Test 2: Test individual crop prediction
    print("\n2. Testing Wheat prediction...")
    try:
        wheat_forecast = get_forecast_for_crop("wheat", current_month=1, forecast_months=6)
        if "error" in wheat_forecast:
            print(f"❌ Wheat prediction error: {wheat_forecast['error']}")
        else:
            print(f"✅ Wheat prediction successful!")
            print(f"   Crop: {wheat_forecast['crop_name']}")
            print(f"   Current month: {wheat_forecast['current_month']}")
            print(f"   Forecast months: {wheat_forecast['forecast_months']}")
            print(f"   Predicted prices: {wheat_forecast['predicted_prices']}")
            if 'crop_info' in wheat_forecast and wheat_forecast['crop_info']:
                print(f"   Latest price: {wheat_forecast['crop_info']['latest_price']}")
    except Exception as e:
        print(f"❌ Error predicting wheat: {e}")
    
    # Test 3: Test another crop
    print("\n3. Testing Paddy prediction...")
    try:
        paddy_forecast = get_forecast_for_crop("paddy", current_month=3, forecast_months=12)
        if "error" in paddy_forecast:
            print(f"❌ Paddy prediction error: {paddy_forecast['error']}")
        else:
            print(f"✅ Paddy prediction successful!")
            print(f"   Predicted prices (12 months): {paddy_forecast['predicted_prices']}")
    except Exception as e:
        print(f"❌ Error predicting paddy: {e}")
    
    # Test 4: Test all crops forecast (limited)
    print("\n4. Testing forecast for all crops (6 months)...")
    try:
        all_forecasts = get_all_crops_forecast(current_month=6, forecast_months=6)
        print(f"✅ Generated forecasts for {len(all_forecasts)} crops")
        
        # Show first 3 crop forecasts as examples
        for i, forecast in enumerate(all_forecasts[:3]):
            print(f"   {forecast['crop_name']}: {forecast['predicted_prices'][:3]}... (showing first 3 months)")
            
    except Exception as e:
        print(f"❌ Error getting all forecasts: {e}")
    
    # Test 5: Test edge cases
    print("\n5. Testing edge cases...")
    
    # Test invalid crop
    try:
        invalid_crop = get_forecast_for_crop("invalidcrop", current_month=1, forecast_months=6)
        if "error" in invalid_crop:
            print(f"✅ Invalid crop handled correctly: {invalid_crop['error']}")
        else:
            print(f"❌ Invalid crop should return error")
    except Exception as e:
        print(f"✅ Invalid crop exception handled: {e}")
    
    # Test invalid month
    try:
        invalid_month = get_forecast_for_crop("wheat", current_month=13, forecast_months=6)
        if "error" in invalid_month:
            print(f"✅ Invalid month handled correctly: {invalid_month['error']}")
        else:
            print(f"❌ Invalid month should return error")
    except Exception as e:
        print(f"✅ Invalid month exception handled: {e}")
    
    print("\n" + "=" * 50)
    print("🎯 Prediction system testing completed!")

if __name__ == "__main__":
    test_prediction_system()
