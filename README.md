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
GET    /api/complaints
GET    /api/complaints/:id
POST   /api/complaints
PUT    /api/complaints/:id
PATCH  /api/complaints/:id/status
DELETE /api/complaints/:id
```

## Notes

This is a simple project made for learning:
- HTML form design
- JavaScript logic
- backend server basics
- API requests
- CRUD operations

It is designed in a basic and easy-to-understand way for beginners.
