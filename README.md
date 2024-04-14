# Task Management API

This project is a backend API for task management, allowing users to sign up, log in, create, update, delete tasks, and log out. It's built using Node.js, Express.js, and MongoDB, with error handling mechanisms implemented.

## Features

- **User Authentication**: Users can sign up, log in, and log out securely.
- **Task CRUD Operations**: Users can create, read, update, and delete tasks.
- **Error Handling**: Comprehensive error handling mechanisms are implemented throughout the API.

## Technologies Used

- **Node.js**: JavaScript runtime for server-side logic.
- **Express.js**: Web application framework for Node.js, simplifying routing and middleware.
- **MongoDB**: NoSQL database for storing user and task data.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB and Node.js, providing a schema-based solution.

## Installation

1. **Clone the repository:**
2. **npm i**
3. **add env variable**
#PORT=5000
#MONGODB_URI=mongodb://localhost:27017/task_manager
#JWT_SECRET=myjwtsecret
4. **npx nodemon**
