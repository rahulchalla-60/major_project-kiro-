# Requirements Document

## Introduction

This feature replaces the dropdown location selector in the weather prediction page with a text input field that allows users to type location names directly. The text input should provide a better user experience by making the typed text clearly visible and allowing for more flexible location entry.

## Requirements

### Requirement 1

**User Story:** As a farmer using the weather prediction tool, I want to type location names directly into a text input field, so that I can quickly enter my specific location without scrolling through a dropdown list.

#### Acceptance Criteria

1. WHEN the weather prediction page loads THEN the system SHALL display a text input field instead of a dropdown for location selection
2. WHEN a user types in the text input field THEN the system SHALL make the typed text clearly visible with appropriate styling
3. WHEN a user enters a location name THEN the system SHALL accept the input and use it for weather data retrieval
4. WHEN a user submits a location THEN the system SHALL attempt to fetch weather data for that location

### Requirement 2

**User Story:** As a user of the weather prediction tool, I want the text input to have good visual feedback, so that I can clearly see what I'm typing and understand the input state.

#### Acceptance Criteria

1. WHEN a user focuses on the text input THEN the system SHALL provide visual feedback indicating the active state
2. WHEN a user types in the input THEN the system SHALL display the text with high contrast and readable font styling
3. WHEN the input is empty THEN the system SHALL show placeholder text guiding the user
4. WHEN the input has content THEN the system SHALL maintain clear text visibility

### Requirement 3

**User Story:** As a user, I want the location input to work seamlessly with the existing weather functionality, so that I can get weather predictions for my typed location.

#### Acceptance Criteria

1. WHEN a user enters a location and triggers the search THEN the system SHALL use the text input value for weather API calls
2. WHEN the weather data is successfully retrieved THEN the system SHALL display the results as before
3. WHEN an invalid location is entered THEN the system SHALL handle the error gracefully
4. WHEN the refresh button is clicked THEN the system SHALL use the current text input value to refetch weather data