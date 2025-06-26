# Mission13 Frontend Documentation

## Overview
The Mission13 project is an AI-powered eco challenge platform designed to gamify daily challenges for climate action. The frontend of the application provides an engaging user interface that allows users to interact with a chatbot, view challenges, and track their progress.

## Project Structure
The frontend is organized into the following directories and files:

- **src/assets/css/**: Contains the CSS files for styling the application.
  - `main.css`: Main styles for layout, typography, and responsive design.
  - `chat.css`: Specific styles for the chatbot interface.

- **src/assets/js/**: Contains JavaScript files for application functionality.
  - `app.js`: Main entry point for the frontend application.
  - `chat.js`: Handles chatbot functionality.
  - `challenges.js`: Manages daily challenges.

- **src/assets/components/**: Contains reusable components for the application.
  - `chatInterface.js`: Creates the chatbot interface.
  - `challengeCard.js`: Displays individual challenge cards.
  - `progressTracker.js`: Visualizes user progress.

- **src/pages/**: Contains HTML pages for the application.
  - `home.html`: Homepage overview of eco challenges and the chatbot.
  - `challenges.html`: List of available challenges.
  - `profile.html`: User profile showing completed challenges.
  - `chat.html`: Chatbot interface for user interaction.

- **src/utils/**: Contains utility functions for the application.
  - `api.js`: Utility functions for API calls.
  - `eco-metrics.js`: Functions for calculating eco metrics.

## Setup Instructions
1. Clone the repository to your local machine.
2. Navigate to the `frontend` directory.
3. Open `index.html` in your web browser to view the application.

## Usage Guidelines
- Users can interact with the chatbot to receive daily eco challenges.
- The challenges can be viewed and selected from the challenges page.
- Users can track their progress through the profile page.

## Contribution
Contributions to the Mission13 project are welcome! Please submit a pull request with your proposed changes.