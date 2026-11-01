# AI Course Review System

An AI-powered course review and feedback management system built with Spring Boot, React, MySQL, and JWT authentication.

The platform allows users to browse courses, submit ratings and written reviews, and view AI-based sentiment analysis. An admin dashboard supports course, user, attendance, and basic review management.

## Features

- User registration and JWT-based authentication
- Course browsing, search, filtering, and course summaries
- Star ratings and written course reviews
- Review browsing and pagination
- AI-powered sentiment analysis for submitted reviews
- User dashboard with recent activity
- Admin dashboard with protected frontend routes
- Admin course management
- Admin user management
- Basic review moderation: view, search/filter, paginate, and delete reviews
- Attendance session and enrollment management
- Light and dark theme support
- Responsive React user interface

## Technology Stack

### Frontend

- React
- React Router
- Axios
- CSS
- Vite

### Backend

- Java
- Spring Boot
- Spring Security
- Spring Data JPA
- JWT authentication
- MySQL
- Maven

## Project Structure

```text
AI-Course-Review-System/
├── backend/        # Spring Boot REST API
├── frontend/       # React application
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

1. Open a terminal and move to the backend directory:

   ```bash
   cd backend
   ```

2. Create a MySQL database for the project.

3. Configure the database connection, username, password, JWT settings, and AI API settings in the backend configuration file.

4. Start the Spring Boot application:

   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup

1. Open a second terminal and move to the frontend directory:

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
| --- | --- |
| Authentication | User registration, login, and JWT-protected API access |
| Dashboard | Displays user activity, reviews, and enrollment-related information |
| Courses | Browse, search, filter, and view course details |
| Reviews | Submit ratings and reviews, browse reviews, and view review data |
| AI Analysis | Generates and displays sentiment analysis for reviews |
| Admin | Provides an admin dashboard for courses, users, attendance, and basic review management |
| Attendance | Supports attendance sessions, student enrollment requests, approvals, and reports |

## Current Review Moderation

The admin dashboard currently supports:

- Viewing all submitted reviews
- Searching and filtering reviews
- Paginating review results
- Deleting reviews
- Viewing available AI analysis data for reviews

## Future Improvements

- Profile management, including viewing and updating account details and changing passwords
- Email verification and password reset
- Enhanced review moderation, including approve/reject or hide actions, reported-review handling, moderation reasons, audit history, and server-side admin authorization
- Docker containerization and cloud deployment
- Automated testing and continuous integration
- Production-ready environment configuration and monitoring

## Author

Gurushankar S

## License

This project is intended for educational purposes.
