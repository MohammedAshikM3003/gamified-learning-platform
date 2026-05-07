# Quick Start Guide

## Prerequisites
- Node.js 18+ and npm

## Install Dependencies
```bash
# Root tooling (if needed)
npm install

# Frontend
npm --prefix frontend install

# Backend
npm --prefix backend install
```

## Start Development Servers
```bash
# Frontend (Vite)
npm --prefix frontend run dev

# Backend (Express)
npm --prefix backend run dev
```

## URLs
- Frontend: http://localhost:5173
- Backend: http://localhost:8000

## Notes
- If PowerShell blocks npm scripts, run:
  `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force`
- Copy env templates before running services:
  - frontend/.env.example -> frontend/.env
  - backend/.env.example -> backend/.env
