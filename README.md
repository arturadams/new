# Data Library API

This project is a simple Next.js application written in TypeScript and styled with Tailwind CSS. It exposes an API for storing arbitrary data objects in a PostgreSQL database (tested with Neon) and provides Swagger documentation. A small web UI lets you manage and export stored outcomes.

## Features

- **Next.js & React** – Application and API routes.
- **TypeScript** – Static type checking.
- **Tailwind CSS** – Utility-first styling.
- **Swagger UI** – Documentation available at `/api-docs`.
- **Persistent Storage** – Records are saved to PostgreSQL.
- **Outcomes UI** – Browse and edit items at `/outcomes`.

## Available Scripts

- `npm run dev` – Start the development server.
- `npm run build` – Build the application for production.
- `npm start` – Start the production server.

The API endpoint `/api/library` supports `GET`, `POST`, and `DELETE`. Additional item routes under `/api/library/[id]` allow updating or removing records. `/api/export/[id]` can export a record as JSON, plain text, or Markdown.

Set the `DATABASE_URL` environment variable to your Neon PostgreSQL connection string before running the server.
