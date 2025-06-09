# AGENTS instructions for Data Library API

## Setup
- Run `npm ci` to install dependencies.

## Environment
- Set `DATABASE_URL` to a PostgreSQL connection string when running locally.
  Netlify provides `NETLIFY_DATABASE_URL` automatically when deployed.

## Tests
- Execute `npm test` to run Jest unit tests.

## Running locally
- Start the development server with `npm run dev`.
- Use `npm run seed` to populate sample data (optional).

## Additional notes
- Target Node.js 18 or newer.
- Avoid commands that require extra network access beyond installing dependencies.
