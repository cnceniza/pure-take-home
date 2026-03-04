# Implementation Plan - PURE Home River

This project is a full-stack Property Agent Management Application. It consists of a Node.js/Express backend and a Vue 3 frontend, both using TypeScript. The backend uses an in-memory data store for this exercise.

## User Review Required

> [!IMPORTANT]
> - The application uses **in-memory storage**, meaning data will be lost when the server restarts.
> - Only **Property Agent CRUD** is implemented in the UI, as per the PRD requirements.
> - Pagination is implemented as a stretch goal for the list view.

## Proposed Changes

### Project Initialization

#### [NEW] `api/` (Backend)
- Initialize a Node.js project with TypeScript.
- Set up Express server with CORS and JSON parsing middleware.
- Create basic folder structure: `src/routes`, `src/controllers`, `src/models`, `src/middleware`.

#### [NEW] `web/` (Frontend)
- Initialize a Vue 3 project using Vite and TypeScript.
- Install and configure **Tailwind CSS v4** using `@tailwindcss/vite`.
- Set up basic folder structure: `src/components`, `src/views`, `src/services`.

---

### Backend Components

#### [NEW] `api/src/models/agent.ts`
- Define `PropertyAgent` interface and `AgentStore` for in-memory management.

#### [NEW] `api/src/controllers/agentController.ts`
- Implement handlers for:
    - `createAgent`: POST `/agents` (with validation)
    - `getAgents`: GET `/agents` (with pagination support)
    - `getAgentById`: GET `/agents/:id`
    - `updateAgent`: PUT `/agents/:id`
    - `deleteAgent`: DELETE `/agents/:id`

#### [NEW] `api/src/routes/agentRoutes.ts`
- Define Express routes mapping to controller methods.

#### [NEW] `api/src/middleware/errorHandler.ts`
- Implement centralized error handling middleware.

---

### Frontend Components

#### [NEW] `web/src/api.ts`
- Axios instance configured with the base backend URL (`http://localhost:3000`).
- Exported as a singleton for use directly in components.

#### [NEW] `web/src/components/AgentList.vue`
- Structured list of agents with stats (names, email, mobile, counts).
- Sub-list for properties when an agent is selected/expanded.

#### [MODIFY] `web/src/components/AgentForm.vue`
- Enhance to show timestamps (Created/Updated) in read-only mode.
- Align styling with the detail panel requirements.

#### [NEW] `web/src/views/Dashboard.vue`
- A clean, simple dashboard variant matching the provided image.
- Focuses on standard UI patterns (standard borders, slate/gray colors).
- High-fidelity reproduction of the "Property Management" design.
- Uses static mock data.

---

### Documentation

#### [NEW] `README.md`
- Setup and execution instructions for both `api` and `web`.
- Documentation of the stretch goal (pagination).

#### [NEW] `PostmanCollection.json`
- Exported Postman collection for manual API testing.

## Verification Plan

### Automated Tests
- No automated tests requested for this MVP, but validation logic will be tested via API calls.

### Manual Verification
1. **Backend Verification**:
   - Run the server in `api/`.
   - Use `curl` or Postman to test each endpoint:
     - `POST /agents` with valid and invalid data.
     - `GET /agents` to verify listing and pagination.
     - `GET /agents/:id` for existing and non-existing IDs.
     - `PUT /agents/:id` to update data.
     - `DELETE /agents/:id` and verify deletion.

2. **Frontend Verification**:
   - Run the dev server in `web/`.
   - Navigate to the agent list.
   - Create a new agent and verify it appears in the list.
   - Edit an agent and verify changes persist in the list.
   - Delete an agent and verify it is removed from the list.
   - Test pagination by adding enough agents to exceed the limit.
