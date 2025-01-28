# Taskify

## Overview
**Taskify** is a simple, user-friendly task management application designed to help users organize and track their daily tasks. It allows users to log in, manage tasks, and keep everything in one place.

![Taskify Logo](./assets/logo.png)

## Features
- **User Authentication**: Login and Registration functionality.
- **Task Management**: Add, edit, and delete tasks.
- **Responsive UI**: Fully responsive design that works well on both mobile and desktop.

## Technologies Used
- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Token)
- **API Calls**: Axios

## Installation

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community)

### Steps to Run Locally

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/taskify.git
    ```

2. Navigate into the project directory:
    ```bash
    cd taskify
    ```

3. Install dependencies for both frontend and backend:
    ```bash
    npm install
    ```

4. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
    ```env
    PORT=7000
    MONGO_URI=mongodb://localhost:27017/taskify
    JWT_SECRET=your-secret-key
    ```

5. Run the backend server:
    ```bash
    npm run server
    ```

6. Run the frontend development server:
    ```bash
    npm start
    ```

7. Open the app in your browser at [http://localhost:3000](http://localhost:3000).

## Usage
- **Login**: Enter your credentials to log in to the application.
- **Tasks**: After logging in, you can view, add, update, or delete tasks.

## API Endpoints

### POST `/api/login`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
