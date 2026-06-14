const projectContainer = document.getElementById('project-container');
const filterSelect = document.getElementById('filter-category');
const sugForm = document.getElementById('suggestion-form');

const API_URL = 'http://localhost:3000/projects';

// 2. PROJECTS LOADING & SMART FILTERING (FIXED & ALIGNED)

async function loadProjects(category = 'all') {
    const loadingSpinner = document.getElementById('loading-spinner');
    const errorDiv = document.getElementById('error-state-user');

    try {
        if (loadingSpinner) loadingSpinner.classList.remove('d-none');
        if (errorDiv) errorDiv.classList.add('d-none');

        const response = await fetch(API_URL);

        if (!response.ok) throw new Error("Database se response nahi mila");

        const data = await response.json();

        if (category !== 'all') {
            const filteredData = data.filter(proj => {
                if (proj.category) {
                    const dbCategory = proj.category.toLowerCase().trim();
                    const selectedCategory = category.toLowerCase().trim();

                    return dbCategory.includes(selectedCategory);
                }
                return false;
            });

            displayCards(filteredData);
        } else {
            displayCards(data);
        }

    } catch (error) {
        console.error("Project Load Error:", error);
        if (errorDiv) errorDiv.classList.remove('d-none');
        if (projectContainer) projectContainer.innerHTML = '';
    } finally {
        if (loadingSpinner) loadingSpinner.classList.add('d-none');
    }
}

function displayCards(projects) {
    if (!projectContainer) {
        console.error("Error: projectContainer element HTML mein nahi mila!");
        return;
    }

    projectContainer.innerHTML = '';

    if (projects.length === 0) {
        projectContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-folder-x text-muted" style="font-size: 3rem;"></i>
                <p class="text-muted mt-2">No projects were found in this category.</p>
            </div>
        `;
        return;
    }

    let allCardsHTML = '';

    projects.forEach(proj => {
        const projectLink = proj.github ? proj.github : '#';


        allCardsHTML += `
            <div class="col">
                <div class="card h-100 shadow-sm border-0">
                    <img src="${proj.image}" class="card-img-top" alt="${proj.title}" 
                         onerror="this.src='https://via.placeholder.com/300x200?text=No+Image+Found'">
                    
                    <div class="card-body">
                        <span class="badge bg-primary text-uppercase mb-2">${proj.category}</span>
                        <h5 class="card-title fw-bold m-0 text-dark">${proj.title}</h5>
                        <p class="card-text text-muted small my-2">${proj.desc}</p>
                        <p class="card-text small mb-0"><strong>Tech:</strong> ${proj.tech}</p>
                    </div>
                    
                    <div class="card-footer bg-transparent border-0 pb-3">
                        <a href="${projectLink}" target="_blank" class="btn btn-primary w-100 fw-semibold">
                            <i class="bi bi-github"></i> View Project
                        </a>
                    </div>
                </div>
            </div>
        `;
    });

    projectContainer.innerHTML = allCardsHTML;
}

// Filter Dropdown Event Listener
if (filterSelect) {
    filterSelect.addEventListener('change', (e) => {
        loadProjects(e.target.value);
    });
}

document.addEventListener('DOMContentLoaded', () => loadProjects());


// 3. FORM VALIDATION & SUBMIT (POST METHOD)
if (sugForm) {
    sugForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        document.querySelectorAll('.error-msg').forEach(el => el.remove());

        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const title = document.getElementById('form-title').value.trim();
        const tech = document.getElementById('form-tech').value.trim();
        const desc = document.getElementById('form-desc').value.trim();

        let hasError = false;

        if (name === "") { showError('form-name', "Name is required!"); hasError = true; }
        if (email === "" || !email.includes('@')) { showError('form-email', "Enter a valid email address!"); hasError = true; }
        if (title === "") { showError('form-title', "Please provide a project title."); hasError = true; }
        if (tech === "") { showError('form-tech', "Technology field is mandatory."); hasError = true; }
        if (desc === "") { showError('form-desc', "Description cannot be empty."); hasError = true; }

        if (hasError) return;

        try {
            const response = await fetch('http://localhost:3000/suggestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, title, tech, desc })
            });

            if (response.ok) {
                sugForm.reset();
                loadProjects();
            } else {
                throw new Error("Server response negative");
            }
        } catch (error) {
            console.error("Server connection error during POST:", error);
            showError('suggestion-form', "Failed to submit suggestion. Server error/JSON Server offline.");
        }
    });
}

function showError(inputId, message) {
    const inputElement = document.getElementById(inputId);
    if (inputElement) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-msg text-danger small mt-1 fw-bold';
        errorDiv.innerText = message;

        if (inputId === 'suggestion-form') {
            inputElement.appendChild(errorDiv);
        } else {
            inputElement.parentElement.appendChild(errorDiv);
        }
    }
}