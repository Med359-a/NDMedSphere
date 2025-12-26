## NDMedSphere — Doctor Portfolio (TypeScript)

A modern multi-page portfolio website built with **Next.js + TypeScript + Tailwind**.

### Pages

- **Home**: `/`
- **About**: `/about`
- **Books**: `/books`
- **Cases**: `/cases`
- **Personal Studying**: `/personal-studying`
- **Videos (upload + gallery)**: `/videos`
- **Contact**: `/contact`

### Customize your details

Update:

- `src/lib/site-config.ts`

### Admin access (private token)

This project uses a **private admin token** (not IP-based) for admin permissions:

- When you log in as admin, you’ll see an **“Admin”** badge in the header and you can **create / delete** content.
- Everyone else can **view** content only.

How it works:

1. Set `ADMIN_TOKEN` in `.env.local` (local dev) / Vercel environment variables (production).
2. Open any page with `?admin=YOUR_TOKEN`, for example:
   - `http://localhost:3000/?admin=YOUR_TOKEN`
3. Middleware validates the token and stores it in an **httpOnly cookie**, then redirects you to the same page **without** the token in the URL.

Logout:

- Open `?admin=logout` to clear the admin cookie.

Security notes:

- Treat `ADMIN_TOKEN` like a password: **never share it**.
- Use a long random token (e.g. `openssl rand -base64 48`).

### Data storage (MongoDB Atlas)

All content is stored in **MongoDB** (recommended for deployment):

- Books / Cases / Personal Studying are stored as documents
- Videos are stored in MongoDB **GridFS** (and streamed via an API route)

Environment variables (copy `env.example` → `.env.local` and fill in real values):

- `MONGODB_URI`
- `MONGODB_DB` (optional, default: `ndmedsphere`)
- `ADMIN_TOKEN` (required for admin access)

### Video uploads (your work portfolio)

The **Videos** page lets you upload video files and view them in a gallery.

- **Upload endpoint**: `POST /api/videos`
- **List videos**: `GET /api/videos`
- **Delete video**: `DELETE /api/videos?id=<videoId>`
- **Stream video**: `GET /api/videos/stream?id=<videoId>`

Notes:

- Videos are stored in **GridFS** (MongoDB) so they persist after deployment.

### Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

### Security note (important)

If you ever pasted a MongoDB connection string publicly (it contains a username/password), you should:

- Rotate the password in MongoDB Atlas
- Prefer a dedicated DB user with least privilege
- Store the URI only in `.env.local` (local) / hosting environment variables (production)
