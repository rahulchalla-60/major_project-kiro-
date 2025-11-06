# Implementation Plan

- [x] 1. Add new state variables for dropdown functionality

  - Add `isDropdownOpen` state to control dropdown visibility
  - Add `filteredCrops` state to store filtered crop results
  - Add `useRef` hook for dropdown container reference
  - _Requirements: 1.1, 1.4_

- [x] 2. Implement dropdown filtering logic

  - Create `filterCrops` function to filter crops based on search input
  - Update `handleCropChange` to trigger filtering on input change
  - Initialize `filteredCrops` with all available crops when dropdown opens
  - _Requirements: 1.2_

- [x] 3. Create dropdown event handlers

  - Implement `handleInputClick` to open dropdown and show all crops
  - Implement `handleCropSelect` to select crop and close dropdown
  - Implement `handleClickOutside` using useEffect and event listeners
  - _Requirements: 1.1, 1.3, 1.4_

- [x] 4. Update JSX structure for custom dropdown

  - Remove existing datalist element and replace with custom dropdown
  - Add dropdown container with conditional rendering based on `isDropdownOpen`
  - Add crop options list with click handlers
  - Add "No crops found" message for empty filtered results
  - _Requirements: 1.1, 1.2, 1.3, 2.4_

- [x] 5. Add CSS styles for dropdown component

  - Style `.crops-dropdown` container with positioning and shadow
  - Style `.crop-option` elements with hover effects
  - Style `.no-crops-message` for empty results
  - Add responsive design considerations for mobile devices
  - _Requirements: 2.1, 2.2, 2.3_

- [x] 6. Implement click outside functionality

  - Add useEffect hook to handle document click events
  - Add cleanup function to remove event listeners
  - Test dropdown closes when clicking outside the component
  - _Requirements: 1.4_

- [x] 7. Add dropdown height limitation and scrolling

  - Limit dropdown to show maximum 10 crops at a time
  - Add scrolling functionality for longer lists
  - Ensure proper positioning below input field
  - _Requirements: 1.5, 2.3_

- [x] 8. Update placeholder text and improve UX

  - Change input placeholder to indicate click functionality
  - Ensure dropdown opens on input focus as well as click
  - Test filtering works correctly as user types
  - _Requirements: 1.1, 1.2_
