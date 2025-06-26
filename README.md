# chit-chat
## ChitChat – Real-Time MERN Stack Messaging App

ChitChat is a full-stack real-time messaging application built using the MERN stack. It allows users to communicate instantly via private or group chats, share messages in real time, manage groups, and upload profile images — all with a responsive and modern UI.
## Deployment
https://chit-chat-front-end.onrender.com/


## Tech Stack

Frontend: React.js (with Vite), Tailwind CSS

Backend: Node.js, Express.js

Database: MongoDB (Mongoose)

Authentication: JWT

Real-Time Communication: Socket.IO

File Uploads: Cloudinary (for profile pictures)

Deployment: Render (backend + frontend)

## Features

1. User Authentication (Sign up, Login)
2. One-on-One Chat
3. Group Chat Creation, Rename, and Member Management
4.  Real-Time Messaging using Socket.IO
5.  Live Notifications for Incoming Messages
6. Cloudinary Profile Picture Upload
7. Responsive UI (works on mobile & desktop)

## Folder Structure

/client         # Frontend (React + Vite)
  /src
    /pages
    /components
    /assets
/server         # Backend (Node.js + Express)
  /routes
  /controllers
  /models
  /config

🔧 Getting Started Locally

1. Clone the Repository

git clone git@github.com:Sanjeev190/chit-chat.git
cd your-repo-name

##  Backend Setup (/server)

cd server
npm install

Create a .env file with the following:

PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

Start the backend:

npm start

## Frontend Setup (/client)

cd client
npm install
npm run dev

🔁 Ensure all API calls use the deployed backend URL.



## Credits

Developed by Sanjeev ThapaInspired by modern messaging platforms like WhatsApp and Messenger.

## License

This project is open-source and available under the MIT License.