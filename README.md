# Data Library API

This project is a simple Next.js application written in TypeScript and styled with Tailwind CSS. It exposes an API for storing arbitrary data objects in a PostgreSQL database (tested with Neon) and provides Swagger documentation. A small, responsive web UI lets you manage and export stored outcomes.

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
- `npm run seed` – Populate the database with sample records.

The API endpoint `/api/library` supports `GET`, `POST`, and `DELETE`. Additional item routes under `/api/library/[id]` allow updating or removing records. `/api/export/[id]` can export a record as JSON, plain text, or Markdown.

Set the `DATABASE_URL` environment variable to your Neon PostgreSQL connection string before running the server.

### Tailwind CSS Setup

Global Tailwind styles are imported in `pages/_app.tsx` via:

```tsx
import '../styles/globals.css'
```

The referenced stylesheet defines the standard Tailwind directives:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

If you add new files that use Tailwind classes, be sure their paths are listed
in `tailwind.config.js` so the framework can generate the necessary styles.

### Seeding Sample Data

To quickly see the UI with some content, run:

```
npm run seed
```

This command populates the `records` table with a few example entries using the same connection string defined in `DATABASE_URL`.

### Deploying to Netlify

1. Push this repo to a Git host and create a new site on Netlify.
2. In **Site settings → Environment variables**, set `DATABASE_URL` to your PostgreSQL connection string.
3. Netlify reads `netlify.toml` and runs `npm run build` with the `@netlify/plugin-nextjs` plugin to deploy the app.
