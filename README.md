# AI Course Review System

An AI-powered course review and feedback management system built with Spring Boot, React, MySQL, and JWT authentication.

The platform lets students browse courses, submit ratings and reviews, and view AI-based sentiment analysis. Administrators can manage course-related data through a dedicated dashboard.

## Features

- User registration and secure JWT-based login
- Course browsing and course summary information
- Star ratings and written course reviews
- Submit, browse, and manage reviews
- AI-powered review and sentiment analysis
- User dashboard with recent activity
- Admin-only dashboard and protected routes
- Responsive React user interface
- Light and dark theme support

## Technology Stack

### Frontend

- React
- React Router
- CSS
- Axios

### Backend

- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- JWT authentication
- MySQL

## Project Structure

```text
AI-Course-Review-System/
├── backend/     # Spring Boot REST API
├── frontend/    # React application
└── README.md
```

## Getting Started

### Prerequisites

Install the following before running the project:

- Java Development Kit (JDK)
- Maven
- Node.js and npm
- MySQL

### Backend Setup

1. Go to the backend folder:

   ```bash
   cd backend
   ```

2. Create a MySQL database for the project.

3. Update the database connection, username, password, and JWT settings in the backend configuration file.

4. Start the Spring Boot application:

   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup

1. Open a second terminal and go to the frontend folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the React application:

   ```bash
   npm run dev
   ```

4. Open the local URL shown in the terminal.

## Main Modules

| Module | Description |
|---|---|
| Authentication | User registration, login, and JWT-protected access |
| Dashboard | Displays user activity and review-related information |
| Courses | Browse courses and view course details |
| Reviews | Submit ratings, write reviews, and browse submitted reviews |
| AI Analysis | Analyzes review sentiment and feedback patterns |
| Admin | Protected area for administrative actions |

## Future Improvements

- Email verification and password reset
- Course search and filtering
- Pagination for reviews
- Profile management
- Review moderation tools
- Deployment with Docker and cloud hosting

## Author

**Gurushankar S**

## License

This project is intended for educational purposes.