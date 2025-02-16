#!/bin/bash

# Define repo URLs
FRONTEND_REPO="https://github.com/Paul-Lecomte/stocker-frontend.git"
BACKEND_REPO="https://github.com/Paul-Lecomte/stocker-backend.git"

# Define directories
FRONTEND_DIR="stocker-frontend"
BACKEND_DIR="stocker-backend"

echo "Starting Stocker installation..."

# Clone repositories if they don't exist
if [ ! -d "$FRONTEND_DIR" ]; then
    echo "Cloning frontend repository..."
    git clone "$FRONTEND_REPO"
else
    echo "Frontend repository already exists. Skipping clone."
fi

if [ ! -d "$BACKEND_DIR" ]; then
    echo "Cloning backend repository..."
    git clone "$BACKEND_REPO"
else
    echo "Backend repository already exists. Skipping clone."
fi

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd "$FRONTEND_DIR"
npm install

cd ..

# Install backend dependencies
echo "Installing backend dependencies..."
cd "$BACKEND_DIR"
npm install

# Setup backend environment file (optional, update with actual values)
if [ ! -f ".env" ]; then
    echo "Creating backend .env file..."
    cat <<EOL > .env
PORT=3000
DATABASE_URI=mongodb://localhost:27017/stocker
JWT_SECRET=your-secret-key
EMAIL_USER=sender@email.com
EMAIL_PASS=senderemailpassword
EOL
fi

cd ..

echo "Installation complete!"
echo "Please enter the information needed in the .env file and then press Y to proceed"
# Wait for user confirmation
while true; do
    read -p "Have you completed the .env setup? (Y/N): " choice
    case "$choice" in
        [Yy]* ) break;;
        [Nn]* ) echo "Please complete the .env file before proceeding.";;
        * ) echo "Please answer Y to continue or N to cancel.";;
    esac
done
echo "Starting backend and frontend..."

# Start backend in the background
cd "$BACKEND_DIR"
npm run dev &

# Start frontend
cd "../$FRONTEND_DIR"
npm run dev