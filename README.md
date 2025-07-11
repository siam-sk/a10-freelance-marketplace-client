# TalentSphere - Freelance Marketplace

![TalentSphere Screenshot](./public/firefox_cYrQeEXfe3.png)

TalentSphere is a modern, full-stack freelance marketplace platform designed to connect clients with skilled freelancers. Built with React, Node.js, Express, and MongoDB, it offers a seamless experience for posting tasks, finding talent, and managing projects.

## Live Site URL

[Visit TalentSphere Live](https://a10-freelance-marketpace.web.app/)

## Repositories

*   **Client-side:** (You are here)
*   **Server-side:** [a10-freelance-marketplace-server](https://github.com/siam-sk/a10-freelance-marketplace-server)

## Key Features

*   **Comprehensive User Dashboard:** A central hub for users to view key stats, manage profile information with an integrated editing modal, and navigate to different sections of the platform.
*   **Dynamic Task Management:** Clients can easily post, view, update, and delete their tasks through an intuitive interface and modals.
*   **Advanced Bidding System:** Freelancers can browse and bid on tasks. The "My Bids" page allows them to track the status (pending, accepted, rejected) of their applications.
*   **User Authentication:** Secure user registration and login functionality handled by Firebase Authentication.
*   **Dynamic Page Titles:** Page titles update dynamically for better user experience and SEO.
*   **Responsive Design & Theming:** A fully responsive UI that adapts to all screen sizes, featuring a user-selectable dark/light theme.
*   **Informational Pages:** Includes beautifully designed "About Us" and "Contact" pages.

## Technologies Used

*   **Frontend:** React, Vite, Tailwind CSS, DaisyUI, React Router, Firebase Authentication, SweetAlert2, React Simple Typewriter
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB
*   **Deployment:** Firebase for frontend, Vercel for backend

## Getting Started

### Prerequisites

*   Node.js (v18.x or later recommended)
*   npm or yarn
*   MongoDB instance (local or cloud-hosted)

### Client Setup

1.  Clone the repository:
    ```bash
    git clone https://your-repo-url/a10-freelance-marketplace-client.git
    cd a10-freelance-marketplace-client
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  Create a `.env` file in the root of the client directory and add your Firebase configuration:
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```
4.  Start the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The client will be running on `http://localhost:5173` (or another port if specified).

### Server Setup

1.  Navigate to the server directory:
    ```bash
    cd ../a10-freelance-marketplace-server
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  Create a `.env` file in the root of the server directory and add your MongoDB connection string and port:
    ```env
    PORT=5000
    DB_USER=your_mongodb_username
    DB_PASS=your_mongodb_password
    MONGODB_URI=mongodb+srv://<username>:<password>@yourcluster.mongodb.net/yourDatabaseName?retryWrites=true&w=majority 
    # (Replace MONGODB_URI with your actual connection string if different, or ensure DB_USER and DB_PASS are used to construct it in index.js)
    ```
    *Note: Ensure your `index.js` in the server correctly uses these environment variables to connect to MongoDB.*
4.  Start the server:
    ```bash
    npm start 
    # or (if you have a dev script like nodemon)
    # npm run dev 
    ```
    The server will be running on `http://a10-freelance-marketplace-server.vercel.app` (or the port specified in your `.env`).

## Project Structure (Client)

```
a10-freelance-marketplace-client/
├── public/
├── src/
│   ├── assets/         # Static assets (images, logos)
│   ├── components/     # Reusable UI components (Header, Footer, etc.)
│   ├── contexts/       # React Context API providers (AuthContext, BidContext)
│   ├── firebase.js     # Firebase configuration and initialization
│   ├── hooks/          # Custom React hooks (if any)
│   ├── layouts/        # Layout components (if any)
│   ├── pages/          # Page components (Home, Login, AddTask, etc.)
│   ├── routes/         # React Router configuration
│   ├── services/       # API service calls (if separated)
│   ├── styles/         # Global styles or Tailwind base (index.css)
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main application component
│   └── main.jsx        # Entry point of the React application
├── .env.example        # Example environment variables
├── .eslintrc.cjs
├── .gitignore
├── index.html          # Main HTML file
├── package.json
├── postcss.config.js
├── README.md
└── tailwind.config.js  # Tailwind CSS configuration
└── vite.config.js      # Vite configuration
```
