# Complaint Routing System 2.0

A clean rebuild of the Complaint Routing System using Next.js, TypeScript, and Supabase.

## Architecture

- Next.js App Router
- TypeScript
- Supabase Auth + PostgreSQL
- Vercel deployment

## Product flow

Register → Submit complaint → Categorize & route → Track → Admin action → Resolution

The first routing implementation will be deterministic and auditable. AI-assisted categorization can be introduced as a later phase without coupling the core complaint workflow to a model.

## Local development

1. Copy `.env.example` to `.env.local`.
2. Add the Supabase publishable key from the CRS 2.0 Supabase project.
3. Install dependencies with `npm install`.
4. Start with `npm run dev`.

Never commit secret service-role keys.
