const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const frontendDir = path.join(__dirname, "../frontend");

const VALID_STATUSES = ["Pending", "In Progress", "Resolved"];
const REQUIRED_FIELDS = [
  "residentName",
  "roomNumber",
  "contact",
  "category",
  "description",
  "priority",
];
const VALID_PRIORITIES = ["Low", "Medium", "High"];
const VALID_CATEGORIES = [
  "Electricity",
  "Plumbing",
  "Water Supply",
  "Internet",
  "Housekeeping",
  "Maintenance",
  "Other",
];

let complaints = [];
let nextId = 1;

function seedComplaints() {
  complaints = [
    {
      id: 1,
      residentName: "Aisha Khan",
      roomNumber: "B-204",
      contact: "9876543210",
      category: "Electricity",
      description: "Power fluctuation in the kitchen area.",
      priority: "High",
      status: "Pending",
      date: "2026-08-15",
      additionalInfo: "Issue started two days ago.",
    },
    {
      id: 2,
      residentName: "Rahul Verma",
      roomNumber: "C-110",
      contact: "9988776655",
      category: "Plumbing",
      description: "Sink pipe leaking under the wash basin.",
      priority: "Medium",
      status: "In Progress",
      date: "2026-08-14",
      additionalInfo: "Maintenance team has been informed.",
    },
  ];
  nextId = 3;
}

seedComplaints();

function getComplaintById(id) {
  return complaints.find((complaint) => complaint.id === Number(id));
}

function sanitizeComplaint(data = {}) {
  return {
    residentName: typeof data.residentName === "string" ? data.residentName.trim() : "",
    roomNumber: typeof data.roomNumber === "string" ? data.roomNumber.trim() : "",
    contact: typeof data.contact === "string" ? data.contact.trim() : "",
    category: typeof data.category === "string" ? data.category.trim() : "",
    description: typeof data.description === "string" ? data.description.trim() : "",
    priority: typeof data.priority === "string" ? data.priority.trim() : "",
    date: typeof data.date === "string" && data.date ? data.date : new Date().toISOString().slice(0, 10),
    additionalInfo: typeof data.additionalInfo === "string" ? data.additionalInfo.trim() : "",
  };
}

function validateComplaint(data) {
  if (!data || typeof data !== "object") {
    return { valid: false, message: "Complaint payload is required." };
  }

  for (const field of REQUIRED_FIELDS) {
    if (!data[field] || String(data[field]).trim() === "") {
      return { valid: false, message: `${field} is required.` };
    }
  }

  if (!VALID_PRIORITIES.includes(data.priority)) {
    return { valid: false, message: "priority must be Low, Medium, or High." };
  }

  if (!VALID_CATEGORIES.includes(data.category)) {
    return { valid: false, message: "category is invalid." };
  }

  return { valid: true };
}

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Origin, X-Requested-With, Accept");
}

function sendJson(res, statusCode, payload) {
  setCorsHeaders(res);
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

function sendEmpty(res, statusCode) {
  setCorsHeaders(res);
  res.writeHead(statusCode);
  res.end();
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".txt": "text/plain; charset=utf-8",
  };

  return types[ext] || "application/octet-stream";
}

function serveStaticFile(res, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      sendJson(res, 404, { message: "File not found." });
      return;
    }

    setCorsHeaders(res);
    res.writeHead(200, { "Content-Type": getContentType(filePath) });
    res.end(data);
  });
}

function serveFrontend(req, res) {
  const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  let relativePath = requestUrl.pathname === "/" ? "index.html" : requestUrl.pathname.replace(/^\/+/, "");
  const safePath = path.join(frontendDir, relativePath);
  const relative = path.relative(frontendDir, safePath);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    sendJson(res, 403, { message: "Forbidden." });
    return;
  }

  fs.stat(safePath, (error, stats) => {
    if (error || !stats.isFile()) {
      sendJson(res, 404, { message: "Page not found." });
      return;
    }

    serveStaticFile(res, safePath);
  });
}

function normalizePathname(pathname) {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.replace(/\/+$/, "") || "/";
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1000000) {
        req.destroy();
        reject(new Error("Request body too large."));
      }
    });

    req.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error("Invalid JSON payload."));
      }
    });

    req.on("error", reject);
  });
}

async function handleApi(req, res) {
  const method = req.method.toUpperCase();
  const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = normalizePathname(requestUrl.pathname);
  const parts = pathname.split("/").filter(Boolean);

  if (pathname === "/api/health") {
    sendJson(res, 200, { status: "ok", message: "Server is healthy" });
    return;
  }

  if (parts[0] !== "api" || parts[1] !== "complaints") {
    sendJson(res, 404, { message: "Route not found." });
    return;
  }

  if (method === "OPTIONS") {
    sendEmpty(res, 204);
    return;
  }

  const complaintId = parts.length >= 3 ? parts[2] : null;

  if (method === "GET" && parts.length === 2) {
    sendJson(res, 200, complaints);
    return;
  }

  if (method === "GET" && parts.length === 3) {
    const complaint = getComplaintById(complaintId);
    if (!complaint) {
      sendJson(res, 404, { message: "Complaint not found." });
      return;
    }
    sendJson(res, 200, complaint);
    return;
  }

  if (method === "POST" && parts.length === 2) {
    try {
      const data = await readRequestBody(req);
      const validation = validateComplaint(data);

      if (!validation.valid) {
        sendJson(res, 400, { message: validation.message });
        return;
      }

      const complaintData = sanitizeComplaint(data);
      const newComplaint = {
        id: nextId++,
        ...complaintData,
        status: "Pending",
      };

      complaints.push(newComplaint);
      sendJson(res, 201, newComplaint);
    } catch (error) {
      sendJson(res, 400, { message: error.message || "Bad request." });
    }
    return;
  }

  if (method === "PUT" && parts.length === 3) {
    try {
      const complaint = getComplaintById(complaintId);
      if (!complaint) {
        sendJson(res, 404, { message: "Complaint not found." });
        return;
      }

      const data = await readRequestBody(req);
      const validation = validateComplaint(data);
      if (!validation.valid) {
        sendJson(res, 400, { message: validation.message });
        return;
      }

      const updatedComplaint = {
        ...complaint,
        ...sanitizeComplaint(data),
        id: complaint.id,
        status: complaint.status,
      };

      complaints = complaints.map((item) =>
        item.id === complaint.id ? updatedComplaint : item
      );

      sendJson(res, 200, updatedComplaint);
    } catch (error) {
      sendJson(res, 400, { message: error.message || "Bad request." });
    }
    return;
  }

  if (method === "PATCH" && parts.length === 4 && parts[3] === "status") {
    try {
      const complaint = getComplaintById(complaintId);
      if (!complaint) {
        sendJson(res, 404, { message: "Complaint not found." });
        return;
      }

      const data = await readRequestBody(req);
      const requestedStatus = data.status;
      if (!requestedStatus || !VALID_STATUSES.includes(requestedStatus)) {
        sendJson(res, 400, {
          message: "status is required and must be one of Pending, In Progress, Resolved.",
        });
        return;
      }

      complaint.status = requestedStatus;
      sendJson(res, 200, complaint);
    } catch (error) {
      sendJson(res, 400, { message: error.message || "Bad request." });
    }
    return;
  }

  if (method === "DELETE" && parts.length === 3) {
    const complaint = getComplaintById(complaintId);
    if (!complaint) {
      sendJson(res, 404, { message: "Complaint not found." });
      return;
    }

    complaints = complaints.filter((item) => item.id !== complaint.id);
    sendJson(res, 200, {
      message: "Complaint deleted successfully.",
      deletedComplaintId: complaint.id,
    });
    return;
  }

  if (method === "POST" && parts.length === 3) {
    sendJson(res, 404, {
      message: "Route not found. Use POST /api/complaints to create a complaint.",
    });
    return;
  }

  if (method === "DELETE" && parts.length === 2) {
    sendJson(res, 404, {
      message: "Route not found. Use DELETE /api/complaints/:id with a complaint id.",
    });
    return;
  }

  sendJson(res, 404, { message: "Route not found." });
}

const app = http.createServer(async (req, res) => {
  try {
    const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const pathname = normalizePathname(requestUrl.pathname);

    if (pathname.startsWith("/api/")) {
      await handleApi(req, res);
      return;
    }

    if (pathname === "/") {
      serveStaticFile(res, path.join(frontendDir, "index.html"));
      return;
    }

    serveFrontend(req, res);
  } catch (error) {
    sendJson(res, 500, { message: error.message || "Internal server error." });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Complaint Manager running on http://localhost:${PORT}`);
  });
}

module.exports = {
  app,
  get complaints() {
    return complaints;
  },
  seedComplaints,
};
