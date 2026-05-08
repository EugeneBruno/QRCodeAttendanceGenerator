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

#### Invalid Role

```txt
400 Bad Request
```

```json
{
  "message": "Invalid role selected"
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

# Course Endpoints

## 3. Create Course

**Protected Route**  
Only `LECTURER` or `ADMIN`

### Endpoint

```http
POST /api/courses
```

### Headers

```http
Authorization: Bearer jwt_token_here
```

### Request Body

```json
{
  "code": "CSC308",
  "title": "Operating Systems"
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
  "message": "Course created successfully",
  "course": {
    "id": "course_id",
    "code": "CSC308",
    "title": "Operating Systems",
    "lecturerId": "lecturer_id",
    "createdAt": "2026-05-07T13:59:18.617Z"
  }
}
```

### Error Responses

#### Unauthorized

```txt
401 Unauthorized
```

```json
{
  "message": "Unauthorized"
}
```

#### Access Denied

```txt
403 Forbidden
```

```json
{
  "message": "Access denied"
}
```

#### Missing Fields

```txt
400 Bad Request
```

```json
{
  "message": "Course code and title are required"
}
```

#### Course Already Exists

```txt
409 Conflict
```

```json
{
  "message": "Course already exists"
}
```

---

## 4. Enroll in Course

**Protected Route**  
Only `STUDENT`

### Endpoint

```http
POST /api/courses/enroll
```

### Headers

```http
Authorization: Bearer jwt_token_here
```

### Request Body

```json
{
  "code": "CSC308"
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
  "message": "Enrollment successful",
  "enrollment": {
    "id": "enrollment_id",
    "studentId": "student_id",
    "courseId": "course_id"
  }
}
```

### Error Responses

#### Unauthorized

```txt
401 Unauthorized
```

```json
{
  "message": "Unauthorized"
}
```

#### Access Denied

```txt
403 Forbidden
```

```json
{
  "message": "Only students can enroll in courses"
}
```

#### Missing Course Code

```txt
400 Bad Request
```

```json
{
  "message": "Course code is required"
}
```

#### Course Not Found

```txt
404 Not Found
```

```json
{
  "message": "Course not found"
}
```

#### Duplicate Enrollment

```txt
409 Conflict
```

```json
{
  "message": "Already enrolled in this course"
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