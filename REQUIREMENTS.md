# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

---

## API Endpoints

### Products
- **Index**: `GET /products`
- **Show**: `GET /products/:id`
- **Create**: `POST /products` (🔒 token required)
- **[OPTIONAL] Top 5 most popular products**: `GET /products/popular`
- **[OPTIONAL] Products by category**: `GET /products/category/:category`

### Users
- **Index**: `GET /users` (🔒 token required)
- **Show**: `GET /users/:id` (🔒 token required)
- **Create**: `POST /users`

### Orders
- **Current Order by user**: `GET /orders/:user_id/current` (🔒 token required)
- **[OPTIONAL] Completed Orders by user**: `GET /orders/:user_id/completed` (🔒 token required)

---

## Database Schema

### Users Table
| Column      | Type      | Constraints           |
|-------------|----------|------------------------|
| id          | SERIAL   | PRIMARY KEY           |
| firstName   | VARCHAR  | NOT NULL              |
| lastName    | VARCHAR  | NOT NULL              |
| password    | VARCHAR  | NOT NULL              |

### Products Table
| Column    | Type      | Constraints           |
|-----------|----------|------------------------|
| id        | SERIAL   | PRIMARY KEY           |
| name      | VARCHAR  | NOT NULL              |
| price     | INTEGER  | NOT NULL              |
| category  | VARCHAR  | NULLABLE              |

### Orders Table
| Column    | Type      | Constraints                        |
|-----------|----------|-------------------------------------|
| id        | SERIAL   | PRIMARY KEY                        |
| user_id   | INTEGER  | REFERENCES users(id) NOT NULL       |
| status    | VARCHAR  | CHECK (status IN ('active','complete')) NOT NULL |

### Order_Products Table (join table for many-to-many relationship)
| Column     | Type      | Constraints                        |
|------------|----------|-------------------------------------|
| id         | SERIAL   | PRIMARY KEY                        |
| order_id   | INTEGER  | REFERENCES orders(id) ON DELETE CASCADE |
| product_id | INTEGER  | REFERENCES products(id) ON DELETE CASCADE |
| quantity   | INTEGER  | NOT NULL                           |

---

## Data Shapes

### Product
```json
{
  "id": 1,
  "name": "Product Name",
  "price": 100,
  "category": "Category Name"
}
```

### User
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "password": "hashed_password"
}
```

### Order
```json
{
  "id": 1,
  "user_id": 1,
  "status": "active",
  "products": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ]
}
```
