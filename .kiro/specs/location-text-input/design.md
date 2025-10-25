# Design Document

## Overview

This design replaces the current dropdown location selector with a text input field in the WeatherPrediction component. The solution maintains backward compatibility with the existing weather API integration while providing a more flexible and user-friendly location entry method.

## Architecture

The design follows the existing React component architecture with minimal changes to the overall structure:

- **Component**: WeatherPrediction.jsx (modified)
- **Styling**: WeatherPrediction.css (modified)
- **State Management**: Existing React useState hooks (modified)
- **API Integration**: Existing weather API calls (enhanced for text-based location handling)

## Components and Interfaces

### Modified WeatherPrediction Component

**State Changes:**
- `selectedLocation`: Changed from predefined location key to free-form text string
- Remove dependency on predefined `locations` array for input validation
- Maintain `locations` array for coordinate lookup and fallback suggestions

**Input Component:**
```jsx
<input 
  type="text"
  value={selectedLocation}
  onChange={(e) => setSelectedLocation(e.target.value)}
  placeholder="Enter location (e.g., Delhi, Mumbai, Bangalore)"
  className="location-input"
/>
```

**Location Resolution Logic:**
1. **Exact Match**: Check if input matches predefined locations (case-insensitive)
2. **Partial Match**: Find closest match from predefined locations
3. **Direct API Call**: Use OpenWeatherMap geocoding API for unknown locations
4. **Fallback**: Default to Delhi if all methods fail

### Enhanced Location Handling

**Location Resolution Function:**
```javascript
const resolveLocation = async (locationText) => {
  // 1. Try exact match with predefined locations
  const exactMatch = locations.find(loc => 
    loc.label.toLowerCase() === locationText.toLowerCase()
  );
  if (exactMatch) return exactMatch;
  
  // 2. Try partial match
  const partialMatch = locations.find(loc =>
    loc.label.toLowerCase().includes(locationText.toLowerCase())
  );
  if (partialMatch) return partialMatch;
  
  // 3. Use geocoding API for unknown locations
  try {
    const geoResponse = await axios.get(
      `${BASE_URL}/geo/1.0/direct?q=${locationText}&limit=1&appid=${API_KEY}`
    );
    if (geoResponse.data.length > 0) {
      const geoData = geoResponse.data[0];
      return {
        value: locationText.toLowerCase().replace(/\s+/g, '-'),
        label: geoData.name,
        coordinates: { lat: geoData.lat, lon: geoData.lon }
      };
    }
  } catch (error) {
    console.warn('Geocoding failed:', error);
  }
  
  // 4. Fallback to default
  return locations.find(loc => loc.value === 'delhi');
};
```

## Data Models

### Location Object Structure
```javascript
{
  value: string,      // Unique identifier (kebab-case)
  label: string,      // Display name
  coordinates: {
    lat: number,      // Latitude
    lon: number       // Longitude
  }
}
```

### Input State
- **Type**: String
- **Default**: "Delhi" (user-friendly default)
- **Validation**: Trimmed, non-empty string
- **Processing**: Case-insensitive matching

## Error Handling

### Input Validation
1. **Empty Input**: Show placeholder text, use default location
2. **Invalid Characters**: Accept all characters, let API handle validation
3. **Network Errors**: Fall back to mock data with user notification

### API Error Handling
1. **Geocoding Failure**: Try partial matching with predefined locations
2. **Weather API Failure**: Use existing fallback to mock data
3. **Rate Limiting**: Implement debouncing for API calls

### User Feedback
- Loading states during location resolution
- Error messages for failed location lookups
- Success indicators when location is found

## Testing Strategy

### Unit Tests
1. **Location Resolution**: Test exact, partial, and API-based matching
2. **Input Validation**: Test empty, invalid, and valid inputs
3. **State Management**: Test input changes and weather data updates

### Integration Tests
1. **API Integration**: Test geocoding and weather API calls
2. **Error Scenarios**: Test network failures and invalid responses
3. **User Interactions**: Test typing, submitting, and refreshing

### User Experience Tests
1. **Input Visibility**: Verify text is clearly visible while typing
2. **Placeholder Text**: Ensure helpful guidance is shown
3. **Focus States**: Test visual feedback for active input
4. **Responsive Design**: Test on different screen sizes

## Implementation Notes

### CSS Styling Requirements
- High contrast text for readability
- Clear focus indicators
- Consistent styling with existing design system
- Responsive behavior for mobile devices

### Performance Considerations
- Debounce API calls to prevent excessive requests
- Cache geocoding results for repeated queries
- Maintain existing weather data caching

### Accessibility
- Proper ARIA labels for screen readers
- Keyboard navigation support
- High contrast mode compatibility
- Focus management