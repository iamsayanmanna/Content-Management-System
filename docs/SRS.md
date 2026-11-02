# Software Requirements Specification (SRS)

## Content Management System (CMS) for a Blog Website

**Project Type:** Academic Mini Project  
**Technology Stack:** React, PHP, MySQL  
**Database Administration:** phpMyAdmin  
**Version:** 1.0

## 1. Introduction

### 1.1 Purpose

The purpose of this project is to develop a web-based Content Management System (CMS) for a blog website. The system will allow an author to manage blog posts through a simple and responsive user interface.

### 1.2 Project Scope

The CMS will provide author login, a dashboard, and the ability to create, edit, delete, and view published blog posts. MySQL will be used to store and manage the application's data.

### 1.3 Intended Users

- **Author:** Logs in and manages blog posts.
- **Website Visitor:** Views published blog posts.

The visitor-facing functionality will be limited to viewing published posts.

## 2. Technology Requirements

| Component | Technology |
|---|---|
| Frontend | React |
| Frontend Tooling | Vite, Node.js, npm |
| Backend | PHP |
| Database | MySQL |
| Database Administration | phpMyAdmin |
| Local Development Environment | XAMPP |
| Version Control | Git and GitHub |

## 3. Functional Requirements

### FR-01: Author Login

The system shall provide a login interface through which an author can authenticate using valid credentials.

### FR-02: Author Dashboard

The system shall provide an author dashboard through which the author can access the available post-management functions.

### FR-03: Create Posts

The system shall allow an authenticated author to create a blog post by entering the required post information.

### FR-04: Edit Posts

The system shall allow an authenticated author to edit an existing blog post.

### FR-05: Delete Posts

The system shall allow an authenticated author to delete an existing blog post.

### FR-06: View Published Posts

The system shall display published blog posts to website visitors.

### FR-07: Database Management

The system shall store and retrieve the data required for author authentication and blog post management using MySQL.

### FR-08: Simple and Responsive Design

The system shall provide a simple, understandable, and responsive interface suitable for common desktop, tablet, and mobile screen sizes.

## 4. Non-Functional Requirements

### 4.1 Usability

The interface should be easy to understand and navigate.

### 4.2 Security

The implementation should protect author authentication and restrict post-management operations to authorized users. Database queries and user-provided content should be handled securely.

### 4.3 Reliability

The system should handle invalid input and operational errors without exposing sensitive technical information to users.

### 4.4 Maintainability

The source code should be organized into clearly separated frontend, backend, and database components.

### 4.5 Responsiveness

The interface should adapt to different screen sizes without compromising essential functionality.

## 5. High-Level System Architecture

1. The user interacts with the React frontend.
2. The frontend sends requests to the PHP backend.
3. The PHP backend validates requests and applies the required authorization checks.
4. PHP communicates with the MySQL database.
5. The backend returns an appropriate response to the frontend.
6. The frontend displays the resulting information to the user.

## 6. Data Requirements

The database design must support the approved functionality, including author authentication and blog post management.

The final table structure, relationships, constraints, and data types will be documented separately in the database design documentation.

## 7. Constraints and Assumptions

- The application will use React, PHP, and MySQL.
- XAMPP will be used for local backend and database development.
- The system is being developed as an academic mini project.
- The final implementation must remain consistent with the approved project scope.
- Additional features will only be considered after approval.

## 8. Acceptance Criteria

The project will be considered functionally complete when:

- An author can log in using valid credentials.
- The author can access the dashboard.
- The author can create, edit, and delete blog posts.
- Published posts can be viewed by website visitors.
- Required data is correctly stored and retrieved from MySQL.
- The interface is usable and responsive.
- The core features have been tested successfully.

## 9. Document Status

**Status:** Initial requirements specification.

This document defines the approved scope and intended requirements. It does not claim that the requirements have already been implemented or tested.
