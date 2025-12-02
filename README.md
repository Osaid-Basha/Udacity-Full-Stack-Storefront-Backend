# Storefront Backend Project

## Getting Started

This repo contains a basic Node and Express app to get you started in constructing an API.  
To get started, clone this repo and run:

```bash
yarn install
```

---

## Required Technologies

Your application must make use of the following libraries:

- **Postgres** for the database
- **Node/Express** for the application logic
- **dotenv** from npm for managing environment variables
- **db-migrate** from npm for migrations
- **jsonwebtoken** from npm for working with JWTs
- **bcrypt** from npm for password hashing
- **jasmine** from npm for testing

---

## Environment Variables

Make sure to set the following environment variables in a `.env` file:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=storefront_dev
DB_NAME_TEST=storefront_test
DB_USER=postgres
DB_PASSWORD=postgres

# Security
BCRYPT_ROUNDS=10
JWT_SECRET=very_secret_jwt_key
JWT_EXPIRES_IN=1h
```

 **Note**: `.env` is included in `.gitignore`, so it won’t be pushed to GitHub.  
For the reviewer, the variables are documented here for project setup.

---

## Database Setup

The project uses **Postgres** running inside Docker.

1. Start the containers:

   ```bash
   docker-compose up -d
   ```

2. Create the dev and test databases:

   ```bash
   db-migrate db:create storefront_dev
   db-migrate db:create storefront_test
   ```

3. Run migrations:

   ```bash
   db-migrate up
   ```

---

## Database Config

`database.json` already maps the environment:

```json
{
  "dev": {
    "driver": "pg",
    "host": "postgres",
    "database": "storefront_dev",
    "user": "postgres",
    "password": "postgres",
    "port": 5432
  },
  "test": {
    "driver": "pg",
    "host": "postgres",
    "database": "storefront_test",
    "user": "postgres",
    "password": "postgres",
    "port": 5432
  }
}
```

---

## Steps to Completion

### 1. Plan to Meet Requirements

In this repo there is a [`REQUIREMENTS.md`](./REQUIREMENTS.md) document which outlines what this API needs to supply for the frontend, as well as the agreed upon data shapes.

- All RESTful routes are documented in `REQUIREMENTS.md`.
- Database schema with tables, columns, and relationships is also included there.

---

### 2. DB Creation and Migrations

- Databases: `storefront_dev` and `storefront_test`
- Run migrations with `db-migrate up`.

Passwords are stored securely using **bcrypt** hashing.

---

### 3. Models

Each table (`users`, `products`, `orders`, `order_products`) has a corresponding model.  
Model methods map to the endpoints defined in `REQUIREMENTS.md`.

---

### 4. Express Handlers

Express routes forward requests to the correct model methods.  
Endpoints match `REQUIREMENTS.md` and are CORS-enabled.

To start the server:

```bash
yarn watch
```

The API will be available at: [http://localhost:3000](http://localhost:3000)

---

### 5. JWTs

- JWTs are required for protected routes (users index, orders, product creation).
- Secret key and expiration are set via environment variables.
- Example to register and receive a token:

```http
POST /users
{
  "firstname": "John",
  "lastname": "Doe",
  "username": "johndoe",
  "password": "123456"
}
```

Response includes a JWT token that should be used in the `Authorization` header:

```
Authorization: Bearer <token>
```

---

### 6. Testing

Run the test suite with:

```bash
yarn test
```

- **Unit tests** cover all database actions.
- **Endpoint tests** cover all RESTful routes.
- Tests are located in the `spec/tests` directory as defined in `spec/support/jasmine.json`.

---

### 7. Quick Example with curl

```bash
# Create a product
curl -X POST http://localhost:3000/products   -H "Content-Type: application/json"   -H "Authorization: Bearer <token>"   -d '{"name":"Book","price":19.99,"category":"education"}'
```

---

### 8. QA and Submission

Before submission, spin up the project and test each endpoint to confirm that it matches the data shapes in `REQUIREMENTS.md`.  
If all endpoints pass and tests succeed, the project is ready for review ✅.
