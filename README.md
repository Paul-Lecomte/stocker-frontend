
# Stocker Frontend

Stocker Frontend is the web-based client for managing stock, inventory, and orders in the Stocker application. This project is built with React.js and communicates with the Stocker Backend API to provide a seamless and efficient user interface for inventory management.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Log in and register securely with JWT.
- **Role-Based Dashboard**: Custom views and actions for different user roles (admin, manager, staff).
- **Real-Time Stock Updates**: Display up-to-date stock levels and order statuses.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Order Management**: Easily manage and track orders.
- **Modern UI**: Clean, intuitive interface built with React and Material-UI.

## Tech Stack

- **React.js**: Frontend framework for building user interfaces.
- **Material-UI**: UI component library for React.
- **Axios**: For making HTTP requests to the backend API.
- **React Router**: Routing library for navigation between different views.

## Setup and Installation

1. Clone the repository:

   \`\`\`bash
   git clone https://github.com/Paul-Lecomte/stocker-frontend.git
   cd stocker-frontend
   \`\`\`

2. Install dependencies:

   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables. Create a `.env` file in the root directory with the following:

   \`\`\`bash
   REACT_APP_API_URL=<Your Backend API URL>
   \`\`\`

4. Start the development server:

   \`\`\`bash
   npm start
   \`\`\`

   The app will be available at `http://localhost:3000`.

## Environment Variables

- **REACT_APP_API_URL**: The URL of the Stocker Backend API.

## Available Scripts

In the project directory, you can run the following scripts:

- `npm start`: Runs the app in the development mode.
- `npm run build`: Builds the app for production.
- `npm test`: Launches the test runner.
- `npm run eject`: Ejects the project from Create React App configuration (use with caution).

## Contributing

We welcome contributions to enhance Stocker Frontend! If you'd like to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes.
4. Submit a pull request.

Please ensure your code follows the existing style and is well tested.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
