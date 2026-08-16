const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");

const { app, seedComplaints } = require("./server");

let server;
let port;

function requestJson(method, path, data) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const req = http.request(
      {
        host: "127.0.0.1",
        port,
        path,
        method,
        headers: payload
          ? { "Content-Type": "application/json" }
          : {},
      },
      (res) => {
        let responseBody = "";

        res.on("data", (chunk) => {
          responseBody += chunk;
        });

        res.on("end", () => {
          const body = responseBody ? JSON.parse(responseBody) : null;
          resolve({ status: res.statusCode, body });
        });
      }
    );

    req.on("error", reject);

    if (payload) {
      req.write(payload);
    }

    req.end();
  });
}

test.before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });

  port = server.address().port;
});

test.after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
});

test.beforeEach(() => {
  seedComplaints();
});

test("GET /api/complaints returns all complaints", async () => {
  const response = await requestJson("GET", "/api/complaints");

  assert.equal(response.status, 200);
  assert.equal(Array.isArray(response.body), true);
  assert.ok(response.body.length >= 2);
});

test("POST /api/complaints creates a complaint", async () => {
  const payload = {
    residentName: "Nisha Patel",
    roomNumber: "A-101",
    contact: "9123456789",
    category: "Internet",
    description: "Wi-Fi is not working in the room.",
    priority: "High",
    date: "2026-08-16",
    additionalInfo: "Need urgent support.",
  };

  const response = await requestJson("POST", "/api/complaints", payload);

  assert.equal(response.status, 201);
  assert.equal(response.body.residentName, payload.residentName);
  assert.equal(response.body.status, "Pending");
});

test("POST /api/complaints returns 400 for missing required field", async () => {
  const payload = {
    residentName: "Nisha Patel",
    roomNumber: "A-101",
    contact: "9123456789",
    category: "Internet",
    priority: "High",
  };

  const response = await requestJson("POST", "/api/complaints", payload);

  assert.equal(response.status, 400);
  assert.match(response.body.message, /description is required/i);
});

test("PUT /api/complaints/:id updates complaint details", async () => {
  const payload = {
    residentName: "Updated Resident",
    roomNumber: "B-204",
    contact: "9876543211",
    category: "Electricity",
    description: "Updated description for the issue.",
    priority: "Medium",
    date: "2026-08-20",
    additionalInfo: "Updated info",
  };

  const response = await requestJson("PUT", "/api/complaints/1", payload);

  assert.equal(response.status, 200);
  assert.equal(response.body.residentName, "Updated Resident");
  assert.equal(response.body.status, "Pending");
});

test("PATCH /api/complaints/:id/status updates complaint status", async () => {
  const response = await requestJson("PATCH", "/api/complaints/1/status", {
    status: "Resolved",
  });

  assert.equal(response.status, 200);
  assert.equal(response.body.status, "Resolved");
});

test("DELETE /api/complaints/:id deletes complaint", async () => {
  const response = await requestJson("DELETE", "/api/complaints/1");

  assert.equal(response.status, 200);
  assert.equal(response.body.message, "Complaint deleted successfully.");
});
