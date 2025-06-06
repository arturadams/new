# Data Library API

This project is a simple Next.js application written in TypeScript and styled with Tailwind CSS. It exposes an API for storing arbitrary data objects in an in-memory store and provides Swagger documentation.

## Features

- **Next.js & React** – Application and API routes.
- **TypeScript** – Static type checking.
- **Tailwind CSS** – Utility-first styling.
- **Swagger UI** – Documentation available at `/api-docs`.

## Available Scripts

- `npm run dev` – Start the development server.
- `npm run build` – Build the application for production.
- `npm start` – Start the production server.

The API endpoint `/api/library` supports `GET` and `POST` requests. `POST` accepts a JSON body with `id`, `type`, and `payload` fields and stores the record in memory.
