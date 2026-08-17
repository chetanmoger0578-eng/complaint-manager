# Complaint Management Website

This is a simple project for managing complaints in an apartment or PG building.

The website lets a user:
- add a complaint
- view all complaints
- edit a complaint
- delete a complaint
- change the complaint status
- search and filter complaints

This project is made to learn basic web development and how frontend and backend connect with each other.

## Project Idea

A resident can submit a complaint like:
- electricity problem
- plumbing issue
- internet issue
- water problem
- housekeeping issue

The admin can then view and manage those complaints in one place.

## Tech Used

- HTML
- CSS
- JavaScript
- Node.js
- Basic backend server using Node

## Project Structure

```text
Complaint Management/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── backend/
│   ├── server.js
│   ├── package.json
│   └── api.test.js
├── screenshots/
├── README.md
└── .gitignore
```

## How to Run

1. Open terminal in the backend folder:

```bash
cd "c:\Users\cheta\OneDrive\Desktop\Complaint Management\backend"
```

2. Start the server:

```bash
node server.js
```

3. Open this in the browser:

```text
http://localhost:3000
```

### Restart the server after code changes

If you see `EADDRINUSE: address already in use :::3000`, port 3000 is already taken by an older server process.

1. Go to the terminal where the server is running.
2. Press **Ctrl+C** to stop it.
3. Start it again:

```bash
cd "c:\Users\cheta\OneDrive\Desktop\Complaint Management\backend"
node server.js
```

Restart the server whenever you change `backend/server.js` so Postman and the browser use the latest API routes.

## Main Features

- Add new complaints
- Display complaint list
- Edit complaint details
- Delete complaint
- Update status: Pending, In Progress, Resolved
- Search complaint by name or room number
- Filter by category and status

## Example Complaint

```json
{
  "residentName": "Aisha Khan",
  "roomNumber": "B-204",
  "contact": "9876543210",
  "category": "Electricity",
  "description": "Power is not working in the kitchen area.",
  "priority": "High",
  "date": "2026-08-15",
  "additionalInfo": "Need urgent support."
}
```

## API Routes

```text
GET    /api/complaints              → return all complaints (200)
GET    /api/complaints/:id          → return one complaint (200 or 404)
POST   /api/complaints              → create a complaint (201 or 400)
PUT    /api/complaints/:id          → update a complaint (200 or 404)
PATCH  /api/complaints/:id/status   → update status only (200 or 404)
DELETE /api/complaints/:id          → delete a complaint (200 or 404)
```

**Valid values**
- **category:** Electricity, Plumbing, Water Supply, Internet, Housekeeping, Maintenance, Other
- **priority:** Low, Medium, High
- **status:** Pending, In Progress, Resolved

**Common Postman mistakes**
- Use **POST** on `http://localhost:3000/api/complaints` — do **not** put an ID in the URL when creating.
- Use **DELETE** on `http://localhost:3000/api/complaints/1` — an ID **is required** in the URL.
- Set **Headers → Content-Type: application/json** for POST, PUT, and PATCH.
- Use **Body → raw → JSON** for request bodies.

## Testing with Postman

Base URL: `http://localhost:3000`

### GET all complaints

- **Method:** GET
- **URL:** `http://localhost:3000/api/complaints`
- **Expected:** `200 OK` with a JSON array

![GET all complaints](screenshots/new%20get.png)

### GET one complaint

- **Method:** GET
- **URL:** `http://localhost:3000/api/complaints/1`
- **Expected:** `200 OK` with one complaint, or `404` if the ID does not exist

![GET one complaint](screenshots/new%20get%201.png)

### POST create complaint

- **Method:** POST
- **URL:** `http://localhost:3000/api/complaints` (no ID in the URL)
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**

```json
{
  "residentName": "Nisha Patel",
  "roomNumber": "A-101",
  "contact": "9123456789",
  "category": "Internet",
  "description": "Wi-Fi is not working in the room.",
  "priority": "High",
  "date": "2026-08-17",
  "additionalInfo": "Need urgent support."
}
```

- **Expected:** `201 Created` with the new complaint (`status: "Pending"`, auto-assigned `id`)

![POST create complaint](screenshots/new%20post.png)

![POST create complaint response](screenshots/new%20post%201.png)

### PUT update complaint

- **Method:** PUT
- **URL:** `http://localhost:3000/api/complaints/1`
- **Headers:** `Content-Type: application/json`
- **Body:** same required fields as POST
- **Expected:** `200 OK` with the updated complaint

![PUT update complaint](screenshots/new%20put.png)

### PATCH update status

- **Method:** PATCH
- **URL:** `http://localhost:3000/api/complaints/1/status`
- **Headers:** `Content-Type: application/json`
- **Body:**

```json
{
  "status": "Resolved"
}
```

- **Expected:** `200 OK` with the updated complaint

![PATCH update status](screenshots/new%20patch.png)

### DELETE complaint

- **Method:** DELETE
- **URL:** `http://localhost:3000/api/complaints/1` (ID required)
- **Expected:** `200 OK`

```json
{
  "message": "Complaint deleted successfully.",
  "deletedComplaintId": 1
}
```

![DELETE complaint](screenshots/new%20delete%20.png)

## Notes

This is a simple project made for learning:
- HTML form design
- JavaScript logic
- backend server basics
- API requests
- CRUD operations

It is designed in a basic and easy-to-understand way for beginners.
