# Next.js Frontend (Network Assignment)

This folder contains a minimal Next.js 15 (App Router) frontend scaffold for the chat UI described in the assignment. It uses Tailwind CSS for styling, Zustand for lightweight state, and a small WebSocket wrapper (socket.io-client fallback).

Quick start (from this folder):

```powershell
npm install
npm run dev
```

Open http://localhost:3000/login to start.

Notes:

- The WebSocket client (`/utils/socket.js`) is a stub that will try to connect to a wss/socket.io server. Replace the URL and token logic to match your backend.
- This scaffold focuses on UI and frontend flows (login -> /chat -> /private/[username]).
