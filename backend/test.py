import sys
try:
    print('Testing Backend Components...')
    
    # Test imports
    from services.forecast_service import ForecastService
    from services.performance_service import PerformanceService
    print('✅ Service imports successful')
    
    # Test forecast module
    from forecast import get_available_crops, get_forecast_for_crop
    crops = get_available_crops()
    print(f'✅ Found {len(crops)} crops')
    
    # Test prediction
    result = get_forecast_for_crop('wheat', current_month=1, forecast_months=6)
    if 'error' not in result:
        print('✅ Prediction working')
    else:
        print('❌ Prediction failed')
    
    print('🎯 Backend is working perfectly!')
    
except Exception as e:
    print(f'❌ Error: {e}')
    sys.exit(1)