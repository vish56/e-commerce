# API DOCUMENTATION — Django + React E-Commerce

Base URL:
http://localhost:8000/api/

Production Base URL:
(To be added after deployment)

---

# AUTHENTICATION

## 1️⃣ Login User

POST /users/login/

Request Body:
{
  "email": "string",
  "password": "string"
}

Response:
{
  "id": number,
  "name": string,
  "email": string,
  "isAdmin": boolean,
  "token": "JWT access token"
}

Authentication: Not Required

---

## 2️⃣ Register User

POST /users/register/

Request Body:
{
  "name": "string",
  "email": "string",
  "password": "string"
}

Response:
{
  "id": number,
  "name": string,
  "email": "string",
  "isAdmin": boolean,
  "token": "JWT access token"
}

Authentication: Not Required

---

## 3️⃣ Get User Profile

GET /users/profile/

Headers:
Authorization: Bearer <token>

Response:
{
  "id": number,
  "name": "string",
  "email": "string",
  "isAdmin": boolean
}

Authentication: Required

---

# PRODUCTS

## 4️⃣ Get All Products

GET /products/

Query Params:
?keyword=
?page=
?sort=

Response:
{
  "products": [ ... ],
  "page": number,
  "pages": number
}

Authentication: Not Required

---

## 5️⃣ Get Single Product

GET /products/:id/

Response:
{
  "_id": string,
  "name": string,
  "price": number,
  "countInStock": number,
  "description": string,
  "image": string
}

Authentication: Not Required

---

## 6️⃣ Create Product (Admin)

POST /products/create/

Headers:
Authorization: Bearer <admin_token>

Response:
Product object

Authentication: Admin Required

---

## 7️⃣ Update Product (Admin)

PUT /products/:id/

Headers:
Authorization: Bearer <admin_token>

Authentication: Admin Required

---

## 8️⃣ Delete Product (Admin)

DELETE /products/:id/

Headers:
Authorization: Bearer <admin_token>

Authentication: Admin Required

---

# ORDERS

## 9️⃣ Create Order

POST /orders/add/

Headers:
Authorization: Bearer <token>

Request Body:
{
  "orderItems": [...],
  "shippingAddress": {...},
  "paymentMethod": "string",
  "itemsPrice": number,
  "taxPrice": number,
  "shippingPrice": number,
  "totalPrice": number
}

Response:
Order object

Authentication: Required

---

## 🔟 Get Order By ID

GET /orders/:id/

Headers:
Authorization: Bearer <token>

Response:
Order object with user + items

Authentication: Required

---

## 1️⃣1️⃣ Get Logged In User Orders

GET /orders/myorders/

Headers:
Authorization: Bearer <token>

Response:
[Order List]

Authentication: Required

---

## 1️⃣2️⃣ Get All Orders (Admin)

GET /orders/

Headers:
Authorization: Bearer <admin_token>

Response:
[All Orders]

Authentication: Admin Required

---

## 1️⃣3️⃣ Mark Order As Paid

PUT /orders/:id/pay/

Headers:
Authorization: Bearer <token>

Response:
Updated order object

Authentication: Required

---

# STOCK SAFETY

Stock deduction is handled inside transaction.atomic.

select_for_update() is used to prevent race conditions.

If stock insufficient:
API returns error response.

---

# ERROR HANDLING FORMAT

Typical Error Response:

{
  "detail": "Error message"
}

---

# SECURITY

- JWT-based authentication
- Admin-only route protection
- Stateless backend
- Token required in Authorization header
- Cart state managed client-side