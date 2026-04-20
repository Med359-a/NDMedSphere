## NDMedSphere - Doctor Portfolio (TypeScript)

A modern multi-page portfolio website built with **Next.js + TypeScript + Tailwind**.

### Pages

- **Home**: `/`
- **About**: `/about`
- **Doctors**: `/doctors`
- **Books**: `/books`
- **Cases**: `/cases`
- **Medical News**: `/medical-news`
- **USMLE**: `/usmle`
- **Videos (upload + gallery)**: `/videos`
- **Contact**: `/contact`

### Customize your details

Update:

- `src/lib/site-config.ts`

### Admin access (private token)

This project uses a **private admin token** (not IP-based) for admin permissions:

- When you log in as admin, you will see an **Admin** badge in the header and you can **create / delete** content.
- Everyone else can **view** content only.

How it works:

1. Set `ADMIN_TOKEN` in `.env.local` (local dev) / Vercel environment variables (production).
2. Open any page with `?admin=YOUR_TOKEN`, for example:
   `http://localhost:3000/?admin=YOUR_TOKEN`
3. Middleware validates the token and stores it in an **httpOnly cookie**, then redirects you to the same page **without** the token in the URL.

Logout:

- Open `?admin=logout` to clear the admin cookie.

Security notes:

- Treat `ADMIN_TOKEN` like a password: **never share it**.
- Use a long random token, for example `openssl rand -base64 48`.

### Data storage (Supabase)

All content is stored in **Supabase**:

- Doctors / Books / Cases / Medical News / USMLE are stored in Postgres tables.
- Photos, files, and videos are stored in Supabase Storage buckets.

Environment variables (copy `env.example` to `.env.local` and fill in real values):

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_URL` (required for the setup/check scripts)
- `ADMIN_TOKEN`
- `MONGODB_URI` / `MONGODB_DB` only if you later want to import recovered MongoDB data

### Supabase setup

Run these once after creating a Supabase project:

```bash
npm install
npm run db:setup
npm run db:check
```

`db:setup` applies `supabase/schema.sql` and creates the required public storage buckets.

### MongoDB recovery import

If MongoDB comes back later and you want to migrate the recovered data into Supabase:

```bash
npm run db:migrate:mongo-to-supabase
```

This script reads the current MongoDB collections/GridFS buckets and copies them into the Supabase tables and storage buckets expected by the app.

### Video uploads

The **Videos** page lets you upload video files and view them in a gallery.

- **Upload endpoint**: `POST /api/videos`
- **List videos**: `GET /api/videos`
- **Delete video**: `DELETE /api/videos?id=<videoId>`
- **Stream video**: `GET /api/videos/stream?id=<videoId>`

### Run locally

```bash
npm install
npm run db:setup
npm run db:check
npm run dev
```

Then open `http://localhost:3000`.

### Security note

If you ever pasted any database URL or service-role secret publicly, rotate it immediately and replace it in both local env files and your hosting provider's environment variables.
