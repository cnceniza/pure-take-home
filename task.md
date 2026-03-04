# PURE Home River - Task List

## Project Setup
- [x] Initialize Repository Structure `[/]`
    - [x] Create `api/` directory for backend
    - [x] Create `web/` directory for frontend
- [x] Backend Setup
    - [x] Initialize Node.js project in `api/`
    - [x] Install dependencies (express, typescript, ts-node-dev, cors, uuid, etc.)
    - [x] Configure `tsconfig.json`
- [x] Frontend Setup
    - [x] Initialize Vue 3 + TypeScript project in `web/` using Vite
    - [x] Install dependencies (axios, etc.)

## Backend Implementation
- [x] Define Data Models & Interfaces `[/]`
    - [x] Create `PropertyAgent` interface
    - [x] Create in-memory data store
- [x] Implement API Routes & Controllers
    - [x] POST `/agents` (Create)
    - [x] GET `/agents` (List with Pagination stretch goal)
    - [x] GET `/agents/:id` (Read)
    - [x] PUT `/agents/:id` (Update)
    - [x] DELETE `/agents/:id` (Delete)
- [x] Error Handling & Validation
    - [x] Implement request validation (email format, required fields)
    - [x] Centralized error middleware

## Frontend Implementation
- [x] Axios Configuration `[/]`
    - [x] Configure Axios instance with Base URL (`web/src/api.ts`)
- [x] Tailwind CSS Integration `[/]`
    - [x] Install `tailwindcss` and `@tailwindcss/vite`
    - [x] Configure Vite plugin and import Tailwind in CSS
- [x] UI Components
    - [x] Dashboard Layout (Two-Column)
    - [x] Agent List (Left Column)
    - [x] Create/Edit Agent Form (Right Column)
    - [x] Property Details View (Right Column)
    - [x] Notes/Reminders View (Right Column)
    - [x] Delete Confirmation Dialog
- [x] Application Logic
    - [x] Handle loading and error states

## Documentation & Deliverables
- [x] Create ER Diagram (Data Model)
- [x] Create `api.http` Request Examples
