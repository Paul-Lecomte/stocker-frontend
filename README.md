
❗Work In Progress❗

![logo](src/assets/stocker_logo.svg)
![logo](src/assets/stocker_name.svg)

# Stocker Frontend

## About the project
Stocker is an inventory management system that allows users to track the stock of furniture items, monitor stock movements, and analyze stock levels through visualizations (i have added many easter eggs be on the lookout).

The backend is built with Node.js, and the frontend is built using React.js and Material Tailwind.

You can find the backend repository [here](https://github.com/Paul-Lecomte/stocker-backend).
## Table of contents
* [Stocker Frontend](#stocker-frontend)
   * [About the project](#about-the-project)
   * [Table of contents](#table-of-contents)
   * [TODO](#todo)
   * [Installation](#installation)
      * [Install script](#-installation-script)
      * [Clone the repo](#clone-the-repo)
         * [Backend](#backend)
         * [Frontend](#frontend)
      * [Using the install script](#using-the-install-script)
   * [Usage](#usage)
      * [Example](#example)
   * [Development usage](#development-usage)
      * [Backend](#backend-1)
      * [Frontend](#frontend-1)
         * [USAGE](#usage-1)
            * [Example](#example-1)

## TODO
Things done and not yet done:
- Stock Overview
   - [x] View all furniture items and their details
   - [x] Include images and descriptions for each furniture item
   - [x] Show aisle locations for furniture items
- Stock Movement Tracking
   - [x] Enable the search of furniture by their name
   - [x] Display stock movements on a graph
   - [x] Fetch stock movements filtered by date ranges
- Dashboard
   - [x] Show stock levels and product information
   - [x] Timezone are selected automatically
   - [x] Display the total number of registered users
- User management
  - [x] Show all the user with their rights
  - [x] Enable the creation of new users
  - [x] Enable the edit of existing user
- Notifications
   - [x] Notification system for stock changes
   - [x] Popup for the notifications
   - [x] Popup for the notifications on the browser
   - [x] Navigate to the furniture page on click
   - [x] Edit the notifications

## Installation
### 🚀 Installation Script

This project includes an install script for easy setup.  
To install and run both the frontend and backend, use:

```bash
chmod +x install.sh && ./install.sh
### Clone the repo
Clone the repository to your local machine.
```bash
git clone https://github.com/Paul-Lecomte/stocker-frontend.git
cd stocker-frontend
```

#### Backend
Navigate to the backend folder and install the dependencies.
```bash
cd backend
npm install
npm run dev
```

#### Frontend
For the frontend, navigate to the frontend folder and install the dependencies.
```bash
cd frontend
npm install
npm run dev
```

### Using the install script
You can also use the install script to set up both the backend and frontend environment.

Download the [install.sh](./install.sh) script and run it in the project folder.

## Usage
To use the project, you'll need some environment variables. Create a `.env` file in the backend folder and add the following variables:
```env
PORT
NODE_ENV
DATABASE_URI
JWT_SECRET
```

### Example
```env
PORT=3000
NODE_ENV=dev
DATABASE_URI=mongodb://localhost:27017/stocker
JWT_SECRET=mysecret
```

## Development usage
### Backend
Navigate to the backend folder and run the server.
```bash
cd backend
npm run start
```

### Frontend
Navigate to the frontend folder and start the React app.
```bash
cd frontend
npm run start
```

#### USAGE
To use the frontend, you'll need to set the following environment variables in the `.env` file in the frontend folder:
```env
VITE_API_URL
VITE_IMG_URL
```

##### Example
```env
VITE_API_URL=http://localhost:3000/api/
VITE_IMG_URL=http://localhost:3000/images/
```

Also if you liked this project consider giving me a follow and a star it helps a lot thanks :3