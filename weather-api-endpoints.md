# Weather Prediction API Endpoints

## Base URL
```
http://localhost:8000/api/weather
```

## 1. Location & Geocoding Endpoints

### GET /api/weather/geocode
**Description**: Convert location name to coordinates
**Parameters**:
- `q` (string, required): Location name/query
- `limit` (int, optional): Number of results to return (default: 1)

**Example Request**:
```
GET /api/weather/geocode?q=London&limit=1
```

**Example Response**:
```json
{
  "status": "success",
  "data": [
    {
      "name": "London",
      "lat": 51.5074,
      "lon": -0.1278,
      "country": "GB",
      "state": "England"
    }
  ]
}
```

### GET /api/weather/reverse-geocode
**Description**: Convert coordinates to location name
**Parameters**:
- `lat` (float, required): Latitude
- `lon` (float, required): Longitude

**Example Request**:
```
GET /api/weather/reverse-geocode?lat=51.5074&lon=-0.1278
```

## 2. Current Weather Endpoints

### GET /api/weather/current
**Description**: Get current weather for a location
**Parameters**:
- `lat` (float, required): Latitude
- `lon` (float, required): Longitude
- `units` (string, optional): Temperature units (metric, imperial, kelvin)

**Example Request**:
```
GET /api/weather/current?lat=51.5074&lon=-0.1278&units=metric
```

**Example Response**:
```json
{
  "status": "success",
  "data": {
    "location": {
      "name": "London",
      "country": "GB",
      "lat": 51.5074,
      "lon": -0.1278
    },
    "current": {
      "date": "2024-01-15",
      "day": "Mon",
      "temperature": {
        "current": 8,
        "max": 12,
        "min": 4,
        "feels_like": 6
      },
      "humidity": 75,
      "rainfall": 2.5,
      "windSpeed": 15,
      "windDirection": 230,
      "pressure": 1013,
      "visibility": 10,
      "uvIndex": 2,
      "condition": "Cloudy",
      "icon": "☁️",
      "description": "overcast clouds"
    }
  }
}
```

### GET /api/weather/current/by-city
**Description**: Get current weather by city name
**Parameters**:
- `city` (string, required): City name
- `units` (string, optional): Temperature units

**Example Request**:
```
GET /api/weather/current/by-city?city=London&units=metric
```

## 3. Weather Forecast Endpoints

### GET /api/weather/forecast
**Description**: Get weather forecast for multiple days
**Parameters**:
- `lat` (float, required): Latitude
- `lon` (float, required): Longitude
- `days` (int, optional): Number of days to forecast (default: 7, max: 14)
- `units` (string, optional): Temperature units

**Example Request**:
```
GET /api/weather/forecast?lat=51.5074&lon=-0.1278&days=7&units=metric
```

**Example Response**:
```json
{
  "status": "success",
  "data": {
    "location": {
      "name": "London",
      "country": "GB"
    },
    "forecast": [
      {
        "date": "2024-01-15",
        "day": "Mon",
        "temperature": {
          "max": 12,
          "min": 4
        },
        "humidity": 75,
        "rainfall": 2.5,
        "windSpeed": 15,
        "condition": "Cloudy",
        "icon": "☁️",
        "description": "overcast clouds"
      }
    ]
  }
}
```

### GET /api/weather/forecast/by-city
**Description**: Get weather forecast by city name
**Parameters**:
- `city` (string, required): City name
- `days` (int, optional): Number of days
- `units` (string, optional): Temperature units

## 4. Agricultural Weather Endpoints

### GET /api/weather/farming-advice
**Description**: Get farming recommendations based on weather
**Parameters**:
- `lat` (float, required): Latitude
- `lon` (float, required): Longitude
- `crop_type` (string, optional): Specific crop type

**Example Request**:
```
GET /api/weather/farming-advice?lat=28.6139&lon=77.2090&crop_type=wheat
```

**Example Response**:
```json
{
  "status": "success",
  "data": {
    "location": "Delhi, India",
    "current_conditions": {
      "temperature": 25,
      "humidity": 60,
      "rainfall": 0
    },
    "farming_advice": [
      "☀️ Good conditions for harvesting mature crops",
      "💧 Monitor soil moisture levels closely",
      "🌾 Ideal temperature for wheat growth"
    ],
    "crop_specific_advice": {
      "wheat": [
        "Current temperature is optimal for wheat growth",
        "Low humidity reduces disease risk"
      ]
    }
  }
}
```

### GET /api/weather/crop-impact
**Description**: Get weather impact analysis for different crops
**Parameters**:
- `lat` (float, required): Latitude
- `lon` (float, required): Longitude

**Example Response**:
```json
{
  "status": "success",
  "data": {
    "location": "Delhi, India",
    "crop_impacts": {
      "wheat": {
        "status": "favorable",
        "description": "Current conditions are favorable for wheat growth",
        "recommendations": ["Monitor irrigation needs"]
      },
      "rice": {
        "status": "needs_irrigation",
        "description": "Rice crops need additional irrigation",
        "recommendations": ["Increase watering frequency"]
      }
    }
  }
}
```

## 5. Historical Weather Endpoints

### GET /api/weather/historical
**Description**: Get historical weather data
**Parameters**:
- `lat` (float, required): Latitude
- `lon` (float, required): Longitude
- `start_date` (string, required): Start date (YYYY-MM-DD)
- `end_date` (string, required): End date (YYYY-MM-DD)

## 6. Weather Alerts Endpoints

### GET /api/weather/alerts
**Description**: Get weather alerts and warnings
**Parameters**:
- `lat` (float, required): Latitude
- `lon` (float, required): Longitude

**Example Response**:
```json
{
  "status": "success",
  "data": {
    "alerts": [
      {
        "type": "heavy_rain",
        "severity": "moderate",
        "title": "Heavy Rain Warning",
        "description": "Heavy rainfall expected in the next 24 hours",
        "start_time": "2024-01-15T18:00:00Z",
        "end_time": "2024-01-16T06:00:00Z"
      }
    ]
  }
}
```

## 7. Utility Endpoints

### GET /api/weather/health
**Description**: Health check for weather service
**Example Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "external_apis": {
    "openweathermap": "connected",
    "geocoding": "connected"
  }
}
```

### GET /api/weather/supported-locations
**Description**: Get list of supported locations/regions
**Example Response**:
```json
{
  "status": "success",
  "data": {
    "total_locations": 50000,
    "coverage": "global",
    "popular_cities": ["London", "New York", "Tokyo", "Delhi"]
  }
}
```

## Error Response Format

All endpoints return errors in this format:
```json
{
  "status": "error",
  "error": {
    "code": "LOCATION_NOT_FOUND",
    "message": "The specified location could not be found",
    "details": "Please check the spelling or try a nearby city"
  }
}
```

## Common Error Codes
- `LOCATION_NOT_FOUND`: Location not found in geocoding
- `API_KEY_INVALID`: Invalid or missing API key
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INVALID_COORDINATES`: Invalid latitude/longitude values
- `SERVICE_UNAVAILABLE`: External weather service unavailable

## Authentication
All endpoints require an API key:
```
Authorization: Bearer YOUR_API_KEY
```

Or as query parameter:
```
?api_key=YOUR_API_KEY
```