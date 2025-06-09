# Data Library API

This project is a simple Next.js application written in TypeScript and styled with Tailwind CSS. It exposes an API for storing arbitrary data objects in a PostgreSQL database (tested with Neon) and provides Swagger documentation. A small, responsive web UI lets you manage and export stored outcomes.

## Features

- **Next.js & React** – Application and API routes.
- **TypeScript** – Static type checking.
- **Tailwind CSS** – Utility-first styling.
- **Swagger UI** – Documentation available at `/api-docs`.
- **Persistent Storage** – Records are saved to PostgreSQL.
- **Outcomes UI** – Browse and edit items on the home page (`/`).

## Available Scripts

- `npm run dev` – Start the development server.
- `npm run build` – Build the application for production.
- `npm start` – Start the production server.
- `npm run seed` – Populate the database with sample records.

The API endpoint `/api/library` supports `GET`, `POST`, and `DELETE`. Additional item routes under `/api/library/[id]` allow updating or removing records. `/api/export/[id]` can export a record as JSON, plain text, or Markdown.

## Environment Variables

The API uses the `@netlify/neon` driver to connect to Postgres. Locally you can
define `DATABASE_URL`:

```bash
export DATABASE_URL=postgres://USER:PASSWORD@HOST/DATABASE
```

When deployed on Netlify, the driver automatically reads
`NETLIFY_DATABASE_URL` (and `NETLIFY_DATABASE_URL_UNPOOLED` if present), so no
additional configuration is necessary.

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

This command populates the `records` table with a few example entries using the
same connection string configured for the application.

### Deploying to Netlify

1. Push this repo to a Git host and create a new site on Netlify.
2. If you are not using Netlify's database add-on, define `DATABASE_URL` in
   **Site settings → Environment variables**. When the add-on is enabled, the
   variables `NETLIFY_DATABASE_URL` and `NETLIFY_DATABASE_URL_UNPOOLED` are set
   automatically.
3. Netlify runs `npm run build`. Next.js outputs a fully static site to the
   `out` directory because `output: 'export'` is set in `next.config.js`.
4. API endpoints are served from Netlify Functions located in `netlify/functions`
   as configured in `netlify.toml`.
