# Mission13 Project

## Overview
Mission13 is an AI-powered eco challenge platform designed to gamify daily challenges for climate action. The project features a chatbot interface that engages users in eco-friendly activities, encouraging them to make sustainable choices in their daily lives.

## Features
- **Chatbot Interface**: Interact with an AI chatbot that provides daily eco challenges and tracks user progress.
- **Daily Challenges**: Users can participate in various challenges aimed at promoting sustainability and reducing their carbon footprint.
- **Progress Tracking**: Visualize your progress in completing challenges and see the impact of your actions.
- **User Profiles**: Each user has a profile that displays their completed challenges and overall progress.

## Project Structure
```
Mission13
├── backend
│   ├── chatbot.py
│   └── .env
├── frontend
│   ├── src
│   │   ├── assets
│   │   │   ├── css
│   │   │   │   ├── main.css
│   │   │   │   └── chat.css
│   │   │   ├── js
│   │   │   │   ├── app.js
│   │   │   │   ├── chat.js
│   │   │   │   └── challenges.js
│   │   │   └── components
│   │   │       ├── chatInterface.js
│   │   │       ├── challengeCard.js
│   │   │       └── progressTracker.js
│   │   ├── pages
│   │   │   ├── home.html
│   │   │   ├── challenges.html
│   │   │   ├── profile.html
│   │   │   └── chat.html
│   │   └── utils
│   │       ├── api.js
│   │       └── eco-metrics.js
│   ├── index.html
│   └── README.md
├── api
│   ├── routes.py
│   └── __init__.py
└── README.md
```

## Setup Instructions
1. **Clone the Repository**: 
   ```
   git clone <repository-url>
   cd Mission13
   ```

2. **Backend Setup**:
   - Navigate to the `backend` directory.
   - Create a `.env` file and add your `OPENROUTER_API_KEY`.
   - Install required packages using:
     ```
     pip install -r requirements.txt
     ```

3. **Frontend Setup**:
   - Navigate to the `frontend` directory.
   - Open `index.html` in your browser to view the application.

4. **Run the Backend**:
   - Start the backend server to handle API requests.

## Contribution Guidelines
- Fork the repository and create a new branch for your feature or bug fix.
- Ensure your code adheres to the project's coding standards.
- Submit a pull request with a clear description of your changes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.