# Architecture Summary

This is actually a React + Vite frontend (not Next.js), but it's well-architected for pairing with a Nest.js backend:

## Key Benefits

### 1. Clean API Abstraction Layer

* services (auth, teams, editions, user) encapsulates all HTTP calls
* Single point to swap the mock Express server for real Nest.js endpoints
* Easy to update base URLs, error handling, token refresh without touching components

### 2. Role-Based Access Control (RBAC) Ready

* isAdmin prop gates create/edit/delete operations
* Login flow captures user role from backend (authService)
* Easily extensible for more granular permissions

### 3. Type Safety

types.ts defines all domain models (Team, Edition, Participant, etc.)

## Design:

## Dashboard 

<img width="1585" height="860" alt="image" src="https://github.com/user-attachments/assets/8d9c001c-fed8-420e-9d6e-9a109aece920" />

## Editions

<img width="1498" height="759" alt="image" src="https://github.com/user-attachments/assets/0ce58dcc-9713-4030-865f-8515e957c8e3" />

## Team Management

<img width="1505" height="760" alt="image" src="https://github.com/user-attachments/assets/d7c8be76-3b02-4c6f-b21c-7d061ae191b0" />

