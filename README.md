# Complaint Management Website

A web app for managing resident complaints in an apartment or PG building. Users can add, view, edit, delete, and update complaint status, with search and filter support.

## Tech Stack

- HTML, CSS, JavaScript
- Node.js (built-in HTTP server)

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
└── README.md
```

## How to Run

```bash
cd backend
node server.js
```

Open `http://localhost:3000` in your browser.

## Features

- Add, edit, and delete complaints
- Update status: Pending, In Progress, Resolved
- Search by name or room number
- Filter by category and status

## API Routes

Base URL: `http://localhost:3000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| GET | `/api/complaints` | Get all complaints |
| GET | `/api/complaints/:id` | Get one complaint by ID |
| POST | `/api/complaints` | Create a new complaint |
| PUT | `/api/complaints/:id` | Update a complaint by ID |
| PATCH | `/api/complaints/:id/status` | Update complaint status |
| DELETE | `/api/complaints/:id` | Delete a complaint by ID |

**Example request body (POST / PUT):**

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

## Postman Screenshots

**new get.png**

![new get.png](screenshots/new%20get.png)

**new get 1.png**

![new get 1.png](screenshots/new%20get%201.png)

**new post.png**

![new post.png](screenshots/new%20post.png)

**new post 1.png**

![new post 1.png](screenshots/new%20post%201.png)

**new put.png**

![new put.png](screenshots/new%20put.png)

**new patch.png**

![new patch.png](screenshots/new%20patch.png)

**new delete .png**

![new delete .png](screenshots/new%20delete%20.png)
