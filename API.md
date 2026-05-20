# GigFlow API Documentation

Base URL: `http://localhost:5000`

All protected routes require: `Authorization: Bearer <token>`

All responses follow:
```json
// Success
{ "success": true, "data": {}, "message": "optional" }

// Error
{ "success": false, "error": "message", "statusCode": 400 }

// Paginated
{ "success": true, "data": [], "meta": { "total": 0, "page": 1, "limit": 10, "totalPages": 0 } }
```

---

## Auth

### POST /api/auth/register
Register a new user.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "sales_user"
}
```
`role` is optional — defaults to `sales_user`. Accepted values: `admin`, `sales_user`.

**Response 201:**
```json
{
  "success": true,
  "data": {
    "token": "<jwt>",
    "user": { "id": "...", "name": "John Doe", "email": "john@example.com", "role": "sales_user" }
  },
  "message": "Registration successful"
}
```

---

### POST /api/auth/login
Login with email and password.

**Body:**
```json
{ "email": "john@example.com", "password": "secret123" }
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "token": "<jwt>",
    "user": { "id": "...", "name": "John Doe", "email": "john@example.com", "role": "sales_user" }
  }
}
```

---

### GET /api/auth/me
Get current authenticated user. **Protected.**

**Response 200:**
```json
{ "success": true, "data": { "id": "...", "name": "...", "email": "...", "role": "..." } }
```

---

## Leads

All lead routes are **protected** (require JWT).

### GET /api/leads
Get paginated leads with optional filters.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `status` | `New\|Contacted\|Qualified\|Lost` | Filter by status |
| `source` | `Website\|Instagram\|Referral` | Filter by source |
| `search` | string | Case-insensitive partial match on name or email |
| `sort` | `latest\|oldest` | Sort by createdAt (default: latest) |
| `page` | number | Page number (default: 1) |

**Example:** `GET /api/leads?status=Qualified&source=Instagram&search=john&sort=latest&page=1`

**Response 200:**
```json
{
  "success": true,
  "data": [ { "_id": "...", "name": "...", "email": "...", "status": "Qualified", "source": "Instagram", "createdAt": "...", "createdBy": { "_id": "...", "name": "...", "email": "..." } } ],
  "meta": { "total": 42, "page": 1, "limit": 10, "totalPages": 5 }
}
```

> **RBAC:** `admin` sees all leads. `sales_user` sees only their own leads.

---

### POST /api/leads
Create a new lead. **Protected.**

**Body:**
```json
{ "name": "Jane Smith", "email": "jane@example.com", "status": "New", "source": "Website" }
```
`status` is optional — defaults to `New`.

**Response 201:**
```json
{ "success": true, "data": { "_id": "...", ... }, "message": "Lead created" }
```

---

### GET /api/leads/:id
Get a single lead by ID. **Protected.**

> `sales_user` can only fetch their own leads.

**Response 200:**
```json
{ "success": true, "data": { "_id": "...", ... } }
```

---

### PUT /api/leads/:id
Update a lead. **Protected.**

**Body** (all fields optional):
```json
{ "name": "Updated Name", "email": "new@email.com", "status": "Contacted", "source": "Referral" }
```

> `sales_user` can only update their own leads.

**Response 200:**
```json
{ "success": true, "data": { "_id": "...", ... }, "message": "Lead updated" }
```

---

### DELETE /api/leads/:id
Delete a lead. **Admin only.**

**Response 200:**
```json
{ "success": true, "data": null, "message": "Lead deleted" }
```

---

### GET /api/leads/export/csv
Export filtered leads as CSV. **Protected.**

Accepts the same query params as `GET /api/leads` (except `page`).

**Response:** `text/csv` file download — `leads-export-YYYY-MM-DD.csv`

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized — missing or invalid token |
| 403 | Forbidden — insufficient role |
| 404 | Not Found |
| 409 | Conflict — duplicate email |
| 500 | Internal Server Error |
