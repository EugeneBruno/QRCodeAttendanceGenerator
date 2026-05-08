# QR Attendance System API Documentation

## Base URL

```txt
http://localhost:3000
```

---

# Authentication Endpoints

## 1. Register User

### Endpoint

```http
POST /api/auth/register
```

### Request Body

```json
{
  "name": "Bruno",
  "email": "bruno@gmail.com",
  "role": "STUDENT",
  "identifier": "AUL/SEN/23/001",
  "password": "12345678"
}
```

### Success Response

Status Code:

```txt
201 Created
```

Response:

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "name": "Bruno",
    "email": "bruno@gmail.com",
    "identifier": "AUL/SEN/23/001",
    "role": "STUDENT",
    "createdAt": "2026-05-07T13:59:18.617Z"
  }
}
```

### Error Responses

#### Missing Fields

```txt
400 Bad Request
```

```json
{
  "message": "All fields are required"
}
```

#### User Already Exists

```txt
409 Conflict
```

```json
{
  "message": "Email or ID number already exists"
}
```

---

## 2. Login User

### Endpoint

```http
POST /api/auth/login
```

### Request Body

```json
{
  "identifier": "AUL/SEN/23/001",
  "password": "12345678"
}
```

### Success Response

Status Code:

```txt
200 OK
```

Response:

```json
{
  "message": "Login successful",
  "user": {
    "id": "user_id",
    "name": "Bruno",
    "email": "bruno@gmail.com",
    "identifier": "AUL/SEN/23/001",
    "role": "STUDENT",
    "createdAt": "2026-05-07T13:59:18.617Z"
  },
  "token": "jwt_token_here"
}
```

### Error Responses

#### Missing Fields

```txt
400 Bad Request
```

```json
{
  "message": "All fields are required"
}
```

#### Invalid Credentials

```txt
401 Unauthorized
```

```json
{
  "message": "Invalid credentials"
}
```

---

# Authentication for Protected Routes

Frontend should include the JWT token in protected requests.

Example:

```http
Authorization: Bearer jwt_token_here
```

---

