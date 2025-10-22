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
