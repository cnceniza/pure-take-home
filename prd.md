Here is a **Product Requirements Document (PRD)** based on the PURE Home River take-home exercise you shared.

---

# Product Requirements Document (PRD)

## Project Title

PURE Home River – Property Agent Management Application

---

# 1. Overview

This project is a simplified full-stack application designed to manage **Property Agents** and their associated rental ecosystem.

The system enables CRUD operations on Property Agents and demonstrates:

* Relational data modeling
* RESTful API design using TypeScript
* Vue-based frontend integration
* Separation of backend and frontend concerns
* Basic error handling strategies

This implementation uses:

* **Node.js + Express + TypeScript** for the backend API
* **Vue 3 + TypeScript** for the web client
* **In-memory data storage** (no database)

---

# 2. Goals & Objectives

### Primary Goals

1. Design a relational data model representing the domain.
2. Build a REST API supporting CRUD operations on Property Agents.
3. Build a Vue web client that integrates with the API.
4. Demonstrate clean architecture and separation of concerns.
5. Include one meaningful stretch improvement beyond requirements.

### Non-Goals

* Production deployment
* Authentication & authorization
* Persistent database storage
* Full multi-entity UI implementation

---

# 3. User Personas

### Property Agent

* Manages rental properties
* Creates notes and reminders
* Oversees tenants and families

For this exercise, only Property Agent CRUD is implemented.

---

# 4. Functional Requirements

---

## 4.1 Data Model (Relational Design)

The system includes the following entities:

### 1. PropertyAgent

* id (UUID or numeric)
* firstName (string, required)
* lastName (string, required)
* email (string, required, unique)
* mobileNumber (string, required)
* createdAt (timestamp, required)
* updatedAt (timestamp, required)

### 2. Property

* id
* agentId (FK → PropertyAgent.id)
* address
* city
* state
* zip

### 3. Family

* id
* familyName

### 4. Tenant

* id
* propertyId (FK → Property.id)
* familyId (FK → Family.id)
* firstName
* lastName

### 5. NoteReminder

* id
* agentId (FK → PropertyAgent.id)
* propertyId (nullable FK → Property.id)
* type (enum: Maintenance, Pest Control, etc.)
* description
* dueDate

### Relationships

* One PropertyAgent → Many Properties
* One Property → Many Tenants
* One Family → Many Tenants
* One PropertyAgent → Many Notes/Reminders
* Optional relationship between NoteReminder and Property

An ER diagram is included in the repository (`data-model.png`).

---

## 4.2 REST API Requirements

### Technology

* Node.js
* Express
* TypeScript
* In-memory data store

### Base URL

```
http://localhost:3000
```

---

## 4.2.1 Endpoints

### 1. Create Property Agent

**POST /agents**

Request Body:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "mobileNumber": "1234567890"
}
```

Response:

* 201 Created
* Returns created agent with timestamps

Error Cases:

* 400 Bad Request (missing required fields)
* 500 Server Error

---

### 2. Get All Agents

**GET /agents**

Response:

* 200 OK
* Returns array of agents

Optional stretch: pagination support

---

### 3. Get Single Agent

**GET /agents/:id**

Response:

* 200 OK
* 404 Not Found if ID does not exist

---

### 4. Update Agent

**PUT /agents/:id**

Request Body:

```json
{
  "firstName": "Updated",
  "lastName": "Name",
  "email": "updated@example.com",
  "mobileNumber": "999999999"
}
```

Response:

* 200 OK
* 404 Not Found if ID does not exist
* 400 Bad Request for invalid input

---

### 5. Delete Agent

**DELETE /agents/:id**

Response:

* 204 No Content
* 404 Not Found if ID does not exist

---

## 4.2.2 Backend Validation

* Required fields enforced on POST/PUT
* Email format validated
* Unique email enforced (in-memory check)
* Appropriate HTTP status codes returned

---

## 4.2.3 Error Handling Strategy

### Backend

* Controller-level validation
* Proper status codes (400, 404, 500)
* Discussion-ready improvement: centralized Express error middleware

### Frontend

* Form validation before submission
* Display API error messages
* Prevent submission if required fields are missing

---

# 4.3 Vue Web Client Requirements

### Technology

* Vue 3
* TypeScript
* Axios (or fetch)
* Optional UI styling framework

### Base URL (Frontend)

```
http://localhost:5173 (default Vue dev server)
```

---

## 4.3.1 UI Features

### 1. Create Agent

* Form with:

  * First Name
  * Last Name
  * Email
  * Mobile Number
* Submit button triggers POST request

### 2. Update Agent

* Pre-filled form
* PUT request on submission

### 3. List All Agents

* Table/grid layout
* Fetch via GET /agents
* Display:

  * Name
  * Email
  * Mobile
  * Created Date
  * Actions (View, Edit, Delete)

### 4. View Single Agent

* Display full details

### 5. Delete Agent

* Delete button
* Confirmation prompt
* DELETE request
* Refresh list after success

---

## 4.3.2 API Integration

* Axios or fetch used for HTTP calls
* Errors caught and displayed
* Loading states implemented

---

## 4.3.3 API Demonstration

HTTP requests demonstrated using:

* Postman collection (exported and included in repo)
  OR
* curl commands documented in README

---

# 5. Stretch Goal

### Selected Improvement: Pagination Support

#### Why?

In real-world systems, returning large datasets without pagination does not scale.

#### Implementation:

* Support query parameters:

  ```
  GET /agents?page=1&limit=10
  ```
* Return:

```json
{
  "data": [...],
  "page": 1,
  "limit": 10,
  "total": 42
}
```

#### Interview Discussion Points:

* Database indexing strategy
* Offset vs cursor pagination
* Impact on frontend UX

---

# 6. Non-Functional Requirements

### Code Quality

* Clean folder structure
* Separation of concerns
* Descriptive commit messages

### Performance

* Efficient in-memory lookups
* Proper filtering for pagination

### Maintainability

* TypeScript interfaces
* Reusable Vue components
* Modular Express routing

---

# 7. Architecture Overview

## Backend Structure

```
api/
 ├── src/
 │   ├── routes/
 │   ├── controllers/
 │   ├── models/
 │   ├── middleware/
 │   └── app.ts
```

## Frontend Structure

```
web/
 ├── src/
 │   ├── components/
 │   ├── views/
 │   ├── composables/
 │   └── services/
```

---

# 8. Repository Deliverables

* ER Diagram (PNG or PDF)
* API source code
* Vue client source code
* Postman collection
* README.md with:

  * Setup instructions
  * API usage examples
  * Stretch goal explanation
  * AI usage explanation

---

# 9. Risks & Mitigations

| Risk                | Mitigation                                   |
| ------------------- | -------------------------------------------- |
| In-memory data loss | Clearly document as intentional for exercise |
| Validation gaps     | Add backend validation logic                 |
| CORS issues         | Enable CORS middleware                       |
| Poor UX             | Implement basic loading and error feedback   |

---

# 10. Interview Preparation Notes

Be prepared to discuss:

* Why Express instead of Nuxt API routes
* Where validation should occur (backend-first philosophy)
* How to convert this into production-ready architecture
* How AI tools were used in development
* Trade-offs of in-memory vs database
* Error handling layering (UI vs API)

---

# Conclusion

This application demonstrates:

* Proper relational modeling
* RESTful API design
* Clean frontend integration
* Thoughtful architectural separation
* Awareness of production-level concerns

---

If you'd like, I can also generate:

* A polished README
* A GitHub repo structure template
* Sample commit history messages
* A technical architecture diagram
* Or a shorter executive-summary PRD version
