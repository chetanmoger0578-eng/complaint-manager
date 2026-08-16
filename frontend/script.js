// ================= ELEMENTS =================

const getButton = document.getElementById("getComplaints");

const complaintForm = document.getElementById("complaintForm");

const API_BASE = "/api/complaints";

const formSection = document.getElementById("formSection");

const newComplaintButton =
    document.getElementById("newComplaintButton");

const cancelButton =
    document.getElementById("cancelButton");

const formTitle =
    document.getElementById("formTitle");

const submitButton =
    document.getElementById("submitButton");

const searchInput =
    document.getElementById("search");

const categoryFilter =
    document.getElementById("filterCategory");

const statusFilter =
    document.getElementById("filterStatus");

let editingId = null;

let allComplaints = [];

getButton.addEventListener("click", getComplaints);

complaintForm.addEventListener("submit", saveComplaint);

searchInput.addEventListener("input", filterComplaints);

categoryFilter.addEventListener("change", filterComplaints);

statusFilter.addEventListener("change", filterComplaints);

newComplaintButton.addEventListener("click", () => {

    editingId = null;

    complaintForm.reset();

    resetForm();

    formSection.classList.remove("hidden");

    formSection.scrollIntoView({
        behavior: "smooth"
    });

});

cancelButton.addEventListener("click", () => {

    editingId = null;

    complaintForm.reset();

    resetForm();

    formSection.classList.add("hidden");

});

async function getComplaints() {

    try {

        const response = await fetch(API_BASE);

        const complaints = await response.json();

        if (!response.ok) {

            alert("Could not load complaints");

            return;

        }

        allComplaints = complaints;

        updateDashboard(complaints);

        filterComplaints();

    }

    catch (error) {

        alert("Server is not running");

    }

}

function updateDashboard(complaints) {

    const total = complaints.length;

    const pending = complaints.filter(
        complaint => complaint.status === "Pending"
    ).length;

    const progress = complaints.filter(
        complaint => complaint.status === "In Progress"
    ).length;

    const resolved = complaints.filter(
        complaint => complaint.status === "Resolved"
    ).length;

    document.getElementById("totalCount").textContent = total;

    document.getElementById("pendingCount").textContent = pending;

    document.getElementById("progressCount").textContent = progress;

    document.getElementById("resolvedCount").textContent = resolved;

}

function displayComplaints(complaints) {

    const complaintBox =
        document.getElementById("complaints");


    if (complaints.length === 0) {

        complaintBox.innerHTML =
            "<p>No complaints found.</p>";

        return;

    }


    let table = `

        <table>

            <tr>

                <th>ID</th>
                <th>Resident</th>
                <th>Room</th>
                <th>Contact</th>
                <th>Category</th>
                <th>Description</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>

            </tr>

    `;


    complaints.forEach(complaint => {


        let statusClass = "";

        if (complaint.status === "Pending") {

            statusClass = "status-pending";

        }

        else if (complaint.status === "In Progress") {

            statusClass = "status-progress";

        }

        else if (complaint.status === "Resolved") {

            statusClass = "status-resolved";

        }


        let priorityClass = "";

        if (complaint.priority === "High") {

            priorityClass = "priority-high";

        }

        else if (complaint.priority === "Medium") {

            priorityClass = "priority-medium";

        }

        else if (complaint.priority === "Low") {

            priorityClass = "priority-low";

        }


        table += `

            <tr>

                <td>${complaint.id}</td>

                <td>${complaint.residentName}</td>

                <td>${complaint.roomNumber}</td>

                <td>${complaint.contact}</td>

                <td>${complaint.category}</td>

                <td>${complaint.description}</td>


                <td>

                    <span class="badge ${priorityClass}">

                        ${complaint.priority}

                    </span>

                </td>


                <td>

                    <span class="badge ${statusClass}">

                        ${complaint.status}

                    </span>

                    <br>

                    <select
                        onchange="updateStatus(${complaint.id}, this.value)"
                    >

                        <option value="Pending"
                            ${complaint.status === "Pending" ? "selected" : ""}>

                            Pending

                        </option>

                        <option value="In Progress"
                            ${complaint.status === "In Progress" ? "selected" : ""}>

                            In Progress

                        </option>

                        <option value="Resolved"
                            ${complaint.status === "Resolved" ? "selected" : ""}>

                            Resolved

                        </option>

                    </select>

                </td>


                <td>${complaint.date}</td>


                <td>

                    <button
                        onclick="editComplaint(${complaint.id})">

                        Edit

                    </button>


                    <button
                        onclick="deleteComplaint(${complaint.id})">

                        Delete

                    </button>

                </td>

            </tr>

        `;

    });


    table += "</table>";

    complaintBox.innerHTML = table;

}

function filterComplaints() {

    const searchText =
        searchInput.value.toLowerCase();

    const selectedCategory =
        categoryFilter.value;

    const selectedStatus =
        statusFilter.value;


    const filteredComplaints =
        allComplaints.filter(complaint => {


            const matchesSearch =

                complaint.residentName
                    .toLowerCase()
                    .includes(searchText)

                ||

                complaint.roomNumber
                    .toLowerCase()
                    .includes(searchText)

                ||

                complaint.description
                    .toLowerCase()
                    .includes(searchText);


            const matchesCategory =

                selectedCategory === "" ||

                complaint.category === selectedCategory;


            const matchesStatus =

                selectedStatus === "" ||

                complaint.status === selectedStatus;


            return (

                matchesSearch &&
                matchesCategory &&
                matchesStatus

            );

        });


    displayComplaints(filteredComplaints);

}

async function saveComplaint(event) {

    event.preventDefault();

    const complaint = {
        residentName: document.getElementById("residentName").value,
        roomNumber: document.getElementById("roomNumber").value,
        contact: document.getElementById("contact").value,
        category: document.getElementById("category").value,
        description: document.getElementById("description").value,
        priority: document.getElementById("priority").value,
        date: document.getElementById("date").value,
        additionalInfo: document.getElementById("additionalInfo").value
    };

    let url = API_BASE;
    let method = "POST";

    if (editingId !== null) {
        url = `${API_BASE}/${editingId}`;
        method = "PUT";
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(complaint)
        });

        const data = await response.json();

        if (response.ok) {
            if (editingId !== null) {
                alert("Complaint updated successfully");
            }
            else {
                alert("Complaint created successfully");
            }

            editingId = null;
            complaintForm.reset();
            resetForm();
            formSection.classList.add("hidden");
            getComplaints();
        }
        else {
            alert(data.message || "Something went wrong.");
        }
    }
    catch (error) {
        console.error("Error saving complaint:", error);
        alert("Server is not running or the request failed.");
    }

}

async function editComplaint(id) {

    const response = await fetch(`${API_BASE}/${id}`);


    const complaint = await response.json();


    if (!response.ok) {

        alert(complaint.message);

        return;

    }


    editingId = id;


    document.getElementById("residentName").value =
        complaint.residentName;

    document.getElementById("roomNumber").value =
        complaint.roomNumber;

    document.getElementById("contact").value =
        complaint.contact;

    document.getElementById("category").value =
        complaint.category;

    document.getElementById("description").value =
        complaint.description;

    document.getElementById("priority").value =
        complaint.priority;

    document.getElementById("date").value =
        complaint.date;

    document.getElementById("additionalInfo").value =
        complaint.additionalInfo;


    formTitle.textContent =
        "Edit Complaint";

    submitButton.textContent =
        "Update Complaint";


    formSection.classList.remove("hidden");


    formSection.scrollIntoView({
        behavior: "smooth"
    });

}

function resetForm() {

    formTitle.textContent =
        "Create Complaint";

    submitButton.textContent =
        "Create Complaint";

}

async function updateStatus(id, status) {

    const response = await fetch(

        `${API_BASE}/${id}/status`,

        {

            method: "PATCH",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                status: status
            })

        }

    );


    const data = await response.json();


    if (response.ok) {

        alert(
            "Complaint status updated successfully"
        );

        getComplaints();

    }

    else {

        alert(data.message);

    }

}

async function deleteComplaint(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this complaint?"
    );


    if (!confirmDelete) {

        return;

    }

    const response = await fetch(

        `${API_BASE}/${id}`,

        {
            method: "DELETE"
        }

    );
    const data = await response.json();


    if (response.ok) {

        alert(
            "Complaint deleted successfully"
        );
        getComplaints();

    }
    else {

        alert(data.message);

    }
}

getComplaints();