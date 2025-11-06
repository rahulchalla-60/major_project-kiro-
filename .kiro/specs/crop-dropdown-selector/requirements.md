# Requirements Document

## Introduction

This feature enhances the crop selection input on the Home page by adding a dropdown functionality that displays all available crops when the user clicks on the input field. This will improve user experience by making crop selection more intuitive and discoverable.

## Requirements

### Requirement 1

**User Story:** As a user, I want to see all available crops in a dropdown when I click on the crop input field, so that I can easily discover and select crops without having to remember their names.

#### Acceptance Criteria

1. WHEN the user clicks on the crop input field THEN the system SHALL display a dropdown list showing all available crops
2. WHEN the user types in the input field THEN the system SHALL filter the dropdown list to show only crops matching the typed text
3. WHEN the user clicks on a crop from the dropdown THEN the system SHALL select that crop and close the dropdown
4. WHEN the user clicks outside the dropdown THEN the system SHALL close the dropdown
5. WHEN the dropdown is open THEN the system SHALL show a maximum of 10 crops at a time with scrolling if needed

### Requirement 2

**User Story:** As a user, I want the dropdown to be visually appealing and easy to navigate, so that I can quickly find and select the crop I'm interested in.

#### Acceptance Criteria

1. WHEN the dropdown is displayed THEN the system SHALL show crop names in a clean, readable format
2. WHEN the user hovers over a crop in the dropdown THEN the system SHALL highlight that crop option
3. WHEN the dropdown is open THEN the system SHALL position it below the input field without overlapping other content
4. WHEN there are no matching crops for the typed text THEN the system SHALL display a "No crops found" message

