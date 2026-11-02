# Test Plan — Blog Website CMS

## 1. Purpose

This document defines the testing approach for verifying the functional requirements, usability, security, and reliability of the Blog Website Content Management System (CMS).

## 2. Scope

Testing will cover the eight approved core features:

1. Author Login
2. Author Dashboard
3. Create Posts
4. Edit Posts
5. Delete Posts
6. View Published Posts
7. Database Management
8. Simple and Responsive Design

## 3. Testing Types

### 3.1 Functional Testing

Verify that each core feature behaves according to the requirements documented in `SRS.md`.

### 3.2 Input Validation Testing

Verify that empty, invalid, or incorrectly formatted inputs are handled appropriately.

### 3.3 Authentication and Authorization Testing

Verify that invalid credentials are rejected and post-management operations cannot be performed by unauthenticated users.

### 3.4 Database Testing

Verify that records are stored, retrieved, updated, and deleted correctly, and that database constraints are enforced.

### 3.5 Responsive UI Testing

Verify that the interface remains usable on common desktop, tablet, and mobile screen sizes.

### 3.6 Error Handling Testing

Verify that expected failures are handled without exposing passwords, database credentials, or sensitive technical details.

## 4. Test Environment

| Component | Planned Environment |
|---|---|
| Operating System | Windows |
| Code Editor | Visual Studio Code |
| Frontend | React with Vite |
| Backend | PHP with XAMPP |
| Database | MySQL |
| Database Administration | phpMyAdmin |
| Browser | A modern web browser |

## 5. Feature-Based Test Areas

| Feature | Test Area |
|---|---|
| Author Login | Valid credentials, invalid credentials, empty inputs |
| Author Dashboard | Access after login, navigation to post-management functions |
| Create Posts | Valid post creation, required-field validation, database persistence |
| Edit Posts | Updating an existing post and verifying saved changes |
| Delete Posts | Deletion confirmation, correct record removal |
| View Published Posts | Displaying published posts and excluding unpublished posts from the public view |
| Database Management | Data integrity, correct relationships, successful CRUD operations |
| Responsive Design | Layout and usability across different screen sizes |

## 6. Entry Criteria

Testing of a feature may begin when:

- Its implementation is available.
- Required dependencies are configured.
- The necessary database and test data are available.
- The relevant test cases have been prepared.

## 7. Exit Criteria

A feature may be marked as tested when:

- Its planned test cases have been executed.
- Expected and actual results have been compared.
- Critical defects have been resolved