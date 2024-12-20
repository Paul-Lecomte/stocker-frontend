
![Alt text](/src/assets/stocker_logo.svg) ![Alt text](src/assets/stocker_name.svg)

# Stocker Frontend

The frontend of the Stocker project is a web application built using React.js, styled with Tailwind CSS and Material Tailwind. It allows users to interact with the furniture inventory, view stock movements, and visualize stock data on graphs.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Running the App](#running-the-app)
- [Features](#features)
- [Contributing](#contributing)

## Installation

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/Paul-Lecomte/stocker-frontend.git
   ```

2. Navigate to the project directory:
   ```bash
   cd stocker-frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and configure the following variables:
   - `REACT_APP_API_URL`: The URL of the backend server


5. You can find the backend here:
   [Stocker Backend Repository](https://github.com/Paul-Lecomte/stocker-backend)


## Configuration

To run the frontend app locally:

```bash
npm run dev
```

This will start the frontend in development mode on [http://localhost:5173](http://localhost:5173).

## Running the App

1. The app displays a dashboard showing user and furniture information.
2. Users can view and update furniture details, track stock movements, and see charts displaying stock levels over time.
3. The app interacts with the backend APIs to fetch and send data about furniture, stock movements, and user authentication.

## Features

- **Furniture Overview**: View all furniture items, including name, quantity, price, and movement history.
- **Stock Movement Graph**: Visualize stock movements using Chart.js for better analysis.
- **Authentication**: Users can register, log in, and access the dashboard with role-based access control.

## Contributing

Contributions are welcome! To contribute, please fork this repository, create a new branch, and submit a pull request with your changes.