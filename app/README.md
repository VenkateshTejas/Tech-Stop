# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Frontend Application

This is a React-based frontend application designed for user authentication and account management. It includes features such as user registration, error handling, and success/error notifications, built using modern tools like Redux Toolkit, Axios, and React Router.

---

## Features

### User Authentication

- **Registration**: Allows new users to sign up by providing a username, email, and password.
- **Email Verification**: After successful registration, users are prompted to verify their email.
- **Error Handling**: Displays custom error messages received from the server for invalid requests.

### State Management

- **Redux Toolkit**: Manages global authentication state (`isAuthenticated`, `isLoading`, `user`, and messages).
- **Error and Success Messages**: Maintains centralized error (`errorMsg`) and success (`successMsg`) messages for user feedback.

### HTTP Requests

- **Axios Integration**: Handles API requests with centralized error handling.
- **Base URL Setup**: Configured a global base URL for Axios to simplify API calls.

### Navigation

- **React Router**: Handles navigation between different application routes.
- **Conditional Routing**: Redirects based on authentication state (e.g., redirects authenticated users from registration/login routes to the dashboard).

### Notifications

- **Auto-Clearing Messages**: Error and success messages automatically clear after 2 seconds.

---

## Folder Structure

## Contributors

These aspects were developed by:

- Tejas venkatesh.te@northeastern.edu
- Dhyey rabadiya.d@northeastern.edu
- Manav kheni.m@northeastern.edu
- Joevita felixanthonyraj.j@northeastern.edu
