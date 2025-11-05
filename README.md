## MongoDB Seeding

To seed roles and an admin user in MongoDB, run:

```sh
yarn run mongo:seed
```

You can customize the admin email by setting ADMIN_EMAIL in your .env file.
## MongoDB Setup

Set the following environment variable in your `.env`:

MONGODB_URI=mongodb://localhost:27017/brand_backend

The application will connect to this URI on startup.

# reach-backend
Ride Sharing

## Deploy to Render

This repo includes a Render Blueprint (`render.yaml`) so you can deploy with a couple of clicks.

### Option A — Blueprint deploy (recommended)
1. Push this branch (`ch-pg-to-mongo`) to GitHub.
2. In the Render dashboard, click New → Blueprint and select this repo.
3. Review the service (brand-backend) and click Apply.
4. After the first build, open the service → Environment and fill in the required variables:
	- `MONGODB_URI` — your MongoDB Atlas connection string
	- `SECRET_KEY` — any random string for sessions and signing
	- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — if you use uploads
	- `MAILJET_API_KEY`, `MAILJET_SECRET_KEY` — if you use email
	- `CORS_ORIGIN` — your frontend origin (or `*` during testing)

The service uses:
- Build command: `npm ci && npm run build`
- Start command: `npm start` (runs `node build/index.js`)
- Health check: `GET /`

Render automatically provides `PORT`. The server reads `process.env.PORT` (defaults to 4001 locally), so no extra config is needed.

### Option B — Manual web service
If you prefer to create a Web Service manually in Render:
1. New → Web Service → Connect your repo
2. Runtime: Node
3. Build command: `npm ci && npm run build`
4. Start command: `npm start`
5. Add the same environment variables listed above

Notes:
- Render doesn’t host MongoDB. Use MongoDB Atlas and paste its connection string into `MONGODB_URI`.
- Seeding is disabled by default in production. You can run `yarn mongo:seed` locally if you need sample data.
