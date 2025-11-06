# Design Document

## Overview

This design enhances the existing crop selection input on the Home page by replacing the current datalist implementation with a custom dropdown component. The new dropdown will provide better user experience by showing all available crops when clicked and allowing real-time filtering as the user types.

## Architecture

The solution will be implemented as a React component enhancement to the existing Home page, utilizing React hooks for state management and event handling. The design follows a controlled component pattern where the dropdown state is managed by the parent component.

### Current Implementation Analysis

The existing implementation uses:

- HTML5 datalist element for autocomplete suggestions
- Input field with `value={selectedCrop}` and `onChange={handleCropChange}`
- `availableCrops` state array populated from the backend API
- CSS styling in `Home.css` for the searchable-select container

### Proposed Enhancement

Replace the datalist approach with a custom dropdown that provides:

- Better visual control and styling consistency
- Click-to-open functionality
- Filtered results display
- Hover states and visual feedback

## Components and Interfaces

### State Management

New state variables to be added to the Home component:

```javascript
const [isDropdownOpen, setIsDropdownOpen] = useState(false);
const [filteredCrops, setFilteredCrops] = useState([]);
```

### Event Handlers

Enhanced and new event handlers:

```javascript
// Enhanced existing handler
const handleCropChange = (event) => {
  const value = event.target.value;
  setSelectedCrop(value);
  setError(null);
  filterCrops(value);
};

// New handlers
const handleInputClick = () => {
  setIsDropdownOpen(true);
  setFilteredCrops(availableCrops);
};

const handleCropSelect = (cropName) => {
  setSelectedCrop(cropName);
  setIsDropdownOpen(false);
  setError(null);
};

const handleClickOutside = (event) => {
  // Close dropdown when clicking outside
  if (!dropdownRef.current?.contains(event.target)) {
    setIsDropdownOpen(false);
  }
};

const filterCrops = (searchTerm) => {
  const filtered = availableCrops.filter((crop) =>
    crop.toLowerCase().includes(searchTerm.toLowerCase())
  );
  setFilteredCrops(filtered);
};
```

### Component Structure

The enhanced searchable-select component structure:

```jsx
<div className="searchable-select" ref={dropdownRef}>
  <input
    type="text"
    value={selectedCrop}
    onChange={handleCropChange}
    onClick={handleInputClick}
    placeholder="Click to select or type to search crops..."
    className="crop-search-input"
  />
  <div className="search-icon">🔍</div>
  {isDropdownOpen && (
    <div className="crops-dropdown">
      {filteredCrops.length > 0 ? (
        <div className="crops-list">
          {filteredCrops.slice(0, 10).map((crop) => (
            <div
              key={crop}
              className="crop-option"
              onClick={() => handleCropSelect(crop)}
            >
              {crop}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-crops-message">No crops found</div>
      )}
    </div>
  )}
</div>
```

## Data Models

### Crop Data Structure

The component will work with the existing crop data structure:

- `availableCrops`: Array of strings representing crop names
- `selectedCrop`: String representing the currently selected crop
- `filteredCrops`: Array of strings representing filtered crop options

### State Models

```javascript
// Dropdown state
isDropdownOpen: boolean

// Filtered results
filteredCrops: string[]

// Existing states (unchanged)
selectedCrop: string
availableCrops: string[]
```

## Error Handling

### Input Validation

- Handle empty search results with "No crops found" message
- Maintain existing error handling for API failures
- Clear errors when user makes new selections

### Edge Cases

- Handle clicking outside dropdown to close it
- Prevent dropdown from opening when no crops are available
- Handle rapid typing without performance issues

### Fallback Behavior

- If `availableCrops` is empty, show fallback crops from existing implementation
- Graceful degradation if dropdown fails to render

## Testing Strategy

### Unit Tests

- Test dropdown open/close functionality
- Test crop filtering logic
- Test crop selection behavior
- Test click outside to close functionality

### Integration Tests

- Test interaction with existing crop data fetching
- Test integration with existing error handling
- Test responsive behavior on different screen sizes

### User Experience Tests

- Test dropdown positioning and visibility
- Test hover states and visual feedback
- Test accessibility with screen readers
- Test keyboard navigation (future enhancement)

## CSS Design Specifications

### Dropdown Container

```css
.crops-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
}
```

### Crop Options

```css
.crop-option {
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f5f5f5;
  text-transform: capitalize;
}

.crop-option:hover {
  background-color: #f8f9fa;
}

.crop-option:last-child {
  border-bottom: none;
}
```

### No Results Message

```css
.no-crops-message {
  padding: 16px;
  text-align: center;
  color: #666;
  font-style: italic;
}
```

### Responsive Considerations

- Dropdown width matches input field width
- Maximum height with scrolling for long lists
- Touch-friendly sizing for mobile devices
- Proper z-index to appear above other content
