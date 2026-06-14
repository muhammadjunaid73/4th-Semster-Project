const API_URL = "http://localhost:3000/projects";

// DOM Bindings
const form = document.getElementById("admin-form");
const titleInput = document.getElementById("p-title");
const categoryInput = document.getElementById("p-category");
const techInput = document.getElementById("p-tech");
const imageInput = document.getElementById("p-img");
const githubInput = document.getElementById("p-github");
const descInput = document.getElementById("p-desc");
const editIdInput = document.getElementById("edit-project-id");
const addBtn = document.getElementById("btn-add");
const updateBtn = document.getElementById("btn-update");
const cancelBtn = document.getElementById("btn-cancel");
const searchInput = document.getElementById("search-input");
const filterBtns = document.querySelectorAll(".filter-btn");
const tableBody = document.getElementById("admin-table-body");
const loadingEl = document.getElementById("loading-state");
const errorEl = document.getElementById("error-state");
const formFeedback = document.getElementById("form-feedback");
const tableWrapper = document.getElementById("table-wrapper-section");

// Stat Bindings
const statTotal = document.getElementById("stat-total");
const statFrontend = document.getElementById("stat-frontend");
const statJS = document.getElementById("stat-js");

let allProjects = [];
let activeFilter = "ALL";


// READ OPERATION (GET DATA)

async function fetchProjects() {
    if (loadingEl) loadingEl.classList.remove("d-none");
    if (errorEl) errorEl.classList.add("d-none");
    if (tableWrapper) tableWrapper.classList.add("opacity-50");

    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP Status Error: ${res.status}`);
        allProjects = await res.json();
        updateStats();
        applyFilterAndSearch();
    } catch (err) {
        if (errorEl) {
            errorEl.classList.remove("d-none");
            errorEl.textContent = `Database Connection Failed: ${err.message}. Ensure JSON Server is up on port 3000.`;
        }
    } finally {
        if (loadingEl) loadingEl.classList.add("d-none");
        if (tableWrapper) tableWrapper.classList.remove("opacity-50");
    }
}

function updateStats() {
    if (!statTotal || !statFrontend || !statJS) return;
    statTotal.textContent = allProjects.length;

    statFrontend.textContent = allProjects.filter(p =>
        p.category && p.category.toLowerCase().trim().includes("frontend")
    ).length;

    statJS.textContent = allProjects.filter(p =>
        p.tech && (p.tech.toLowerCase().includes("js") || p.tech.toLowerCase().includes("javascript"))
    ).length;
}

function renderTable(projects) {
    if (!tableBody) return;
    tableBody.innerHTML = "";

    if (projects.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">No portfolio records match current filters.</td></tr>`;
        return;
    }

    projects.forEach((proj, index) => {
        // Safe mapping verification for db.json discrepancy (image vs img)
        const projectImageSrc = proj.image || proj.img || 'https://via.placeholder.com/45x35?text=No+Img';

        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="ps-3 fw-bold text-secondary">${index + 1}</td>
            <td>
                <img src="${projectImageSrc}" class="rounded shadow-sm border" width="45" height="35" style="object-fit: cover;" onerror="this.src='https://via.placeholder.com/45x35?text=Error'">
            </td>
            <td class="fw-bold text-dark">${proj.title}</td>
            <td><span class="badge bg-light text-primary border">${proj.category}</span></td>
            <td class="small text-muted">${proj.tech}</td>
            <td class="text-center">
                <div class="btn-group gap-1">
                    <button class="btn btn-sm btn-outline-primary rounded-2" onclick="loadEdit('${proj.id}')"><i class="bi bi-pencil-square"></i> Edit</button>
                    <button class="btn btn-sm btn-outline-danger rounded-2" onclick="deleteProject('${proj.id}', this)"><i class="bi bi-trash3"></i> Delete</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// VALIDATION & SUBMISSION ENGINE (POST / PUT)
if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");
        if (formFeedback) formFeedback.className = "alert d-none py-2 text-center small fw-bold";

        let validationPassed = true;

        if (!titleInput.value.trim()) {
            document.getElementById("err-p-title").textContent = "Project Title cannot be blank.";
            validationPassed = false;
        }
        if (!categoryInput.value.trim()) {
            document.getElementById("err-p-category").textContent = "Project Category mapping is mandatory.";
            validationPassed = false;
        }
        if (!techInput.value.trim()) {
            document.getElementById("err-p-tech").textContent = "Tech specifications are required.";
            validationPassed = false;
        }

        if (!validationPassed) return;

        const rawImgValue = imageInput.value.trim() || "https://via.placeholder.com/300x200";

        // Object holds both key configurations to satisfy system queries flawlessly
        const projectData = {
            title: titleInput.value.trim(),
            category: categoryInput.value.trim(),
            tech: techInput.value.trim(),
            img: rawImgValue,
            image: rawImgValue,
            github: githubInput.value.trim() || "#",
            desc: descInput.value.trim() || "No detailed description provided."
        };

        const id = editIdInput.value;
        const isEditing = id !== "";

        try {
            let res;
            if (isEditing) {
                res = await fetch(`${API_URL}/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(projectData)
                });
            } else {
                res = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(projectData)
                });
            }

            if (!res.ok) throw new Error(`Server Pipeline Refused Transaction (Status: ${res.status})`);

            resetForm();
            await fetchProjects();

            if (formFeedback) {
                formFeedback.classList.remove("d-none");
                formFeedback.classList.add("alert-success");
                formFeedback.textContent = isEditing ? "🎉 Project parameters modified successfully!" : "🚀 Dynamic portfolio card added successfully!";
                setTimeout(() => formFeedback.classList.add("d-none"), 4000);
            }

        } catch (err) {
            if (formFeedback) {
                formFeedback.classList.remove("d-none");
                formFeedback.classList.add("alert-danger");
                formFeedback.textContent = `Write Operation Refused: ${err.message}`;
            }
        }
    });
}


// EDIT MODALITY (POPULATE FORM)
window.loadEdit = function (id) {
    const proj = allProjects.find(p => String(p.id) === String(id));
    if (!proj) return;

    form.scrollIntoView({ behavior: 'smooth' });

    editIdInput.value = proj.id;
    titleInput.value = proj.title || "";
    categoryInput.value = proj.category || "";
    techInput.value = proj.tech || "";


    imageInput.value = proj.image || proj.img || "";

    githubInput.value = proj.github || "";
    descInput.value = proj.desc || "";

    document.getElementById("form-title-text").innerHTML = '<i class="bi bi-pencil-square"></i> Edit Portfolio Item';
    if (addBtn) addBtn.classList.add("d-none");
    if (updateBtn) updateBtn.classList.remove("d-none");
    if (cancelBtn) cancelBtn.classList.remove("d-none");
};


// DELETE DESTRUCTIVE ACTION
window.deleteProject = async function (id, buttonElement) {
    if (!buttonElement.dataset.confirmed) {
        buttonElement.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i> Confirm?`;
        buttonElement.className = "btn btn-sm btn-danger";
        buttonElement.dataset.confirmed = "true";

        setTimeout(() => {
            buttonElement.innerHTML = `<i class="bi bi-trash3"></i> Delete`;
            buttonElement.className = "btn btn-sm btn-outline-danger";
            delete buttonElement.dataset.confirmed;
        }, 3000);
        return;
    }

    try {
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Database rejected current purge operation.");
        await fetchProjects();
    } catch (err) {
        if (errorEl) {
            errorEl.classList.remove("d-none");
            errorEl.textContent = `Deletion sequence aborted: ${err.message}`;
        }
    }
};

function resetForm() {
    if (form) form.reset();
    if (editIdInput) editIdInput.value = "";
    document.getElementById("form-title-text").innerHTML = '<i class="bi bi-plus-circle"></i> Add New Project';
    if (addBtn) addBtn.classList.remove("d-none");
    if (updateBtn) updateBtn.classList.add("d-none");
    if (cancelBtn) cancelBtn.classList.add("d-none");
    document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");
}

if (cancelBtn) cancelBtn.addEventListener("click", resetForm);

// SEARCH & FILTER COMBINED LOGIC (FIXED)

function applyFilterAndSearch() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

    let filtered = allProjects.filter(p => {
        const projectTitle = p.title ? p.title.toLowerCase().trim() : "";
        const projectTech = p.tech ? p.tech.toLowerCase().trim() : "";
        const projectCategory = p.category ? p.category.toLowerCase().trim() : "";

        
        const matchesSearch = projectTitle.includes(query) || projectTech.includes(query);

        
        let matchesButton = true;

        if (activeFilter === "FRONTEND") {
            
            matchesButton = projectCategory.includes("frontend");
        } else if (activeFilter === "JS") {

            matchesButton = projectCategory === "js" || projectCategory.includes("js") || projectTech.includes("js") || projectTech.includes("javascript");
        }

        return matchesSearch && matchesButton;
    });

    renderTable(filtered);
}
if (searchInput) {
    searchInput.addEventListener("input", applyFilterAndSearch);
}

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.replace("btn-secondary", "btn-outline-secondary"));
        btn.classList.replace("btn-outline-secondary", "btn-secondary");

        activeFilter = btn.dataset.filter || "ALL";
        applyFilterAndSearch();
    });
});


// LIVE VALIDATION OBSERVERS

const inputsArray = [
    { element: titleInput, errorId: "err-p-title" },
    { element: categoryInput, errorId: "err-p-category" },
    { element: techInput, errorId: "err-p-tech" }
];

inputsArray.forEach(item => {
    if (item.element) {
        item.element.addEventListener("input", () => {
            const errorElement = document.getElementById(item.errorId);
            if (errorElement && item.element.value.trim() !== "") {
                errorElement.textContent = "";
            }
        });
    }
});

// Initial Pipeline Invocation
fetchProjects();