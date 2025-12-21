## NDMedSphere — Doctor Portfolio / Clinic Website (TypeScript)

A modern multi-page clinic website built with **Next.js + TypeScript + Tailwind**.

### Pages

- **Home**: `/`
- **About**: `/about`
- **Services**: `/services`
- **Work / Portfolio**: `/work`
- **Videos (upload + gallery)**: `/videos`
- **Contact**: `/contact`

### Customize your details

Update:

- `src/lib/site-config.ts`

### Video uploads (your work portfolio)

The **Videos** page lets you upload video files and view them in a gallery.

- **Upload endpoint**: `POST /api/videos`
- **List videos**: `GET /api/videos`
- **Delete video**: `DELETE /api/videos?id=<videoId>`
- **Saved files**: `public/uploads/videos`
- **Metadata**: `data/videos.json`

Notes:

- This stores files **locally on the server disk** (great for local dev / a traditional Node server).
- Many “serverless” hosting environments don’t support persistent disk writes—if you plan to deploy that way, we should switch storage to S3/R2/etc.

### Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.
