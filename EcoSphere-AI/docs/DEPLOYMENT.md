# EcoSphere AI Deployment Guide

## Overview

This document describes the deployment process for the EcoSphere AI platform.

---

## Tech Stack

- Frontend: React.js + Vite
- Backend: Node.js + Express.js
- Database: MongoDB Atlas
- AI Service: Google Gemini API

---

## Deployment Platforms

| Component | Platform |
|-----------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |

---

## Environment Variables

Backend requires the following environment variables:

- MONGODB_URI
- JWT_SECRET
- GEMINI_API_KEY
- PORT

---

## Deployment Steps

### Frontend

1. Build the React application.
2. Connect the GitHub repository to Vercel.
3. Configure environment variables.
4. Deploy.

### Backend

1. Connect the repository to Render.
2. Configure Node.js runtime.
3. Add required environment variables.
4. Deploy backend services.

### Database

1. Create a MongoDB Atlas cluster.
2. Add the connection string.
3. Allow network access.
4. Connect the backend.

---

## Verification Checklist

- Frontend loads successfully.
- Backend APIs respond correctly.
- Database connection is successful.
- Authentication works properly.
- AI services are accessible.

---

## Deployment Status

Deployment documentation prepared.

Deployment verification will be updated after the application is deployed.