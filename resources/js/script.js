let internships = [];
let filteredInternships = [];
let currentPage = 1;
const jobsPerPage = 10;

// Load internships from JSON
async function loadInternships() {
  try {
    const res = await fetch("resources/js/internships_dataset_large.json");
    internships = await res.json();
    filteredInternships = internships; // default: show all
    updateResultsCount();
    renderJobs();
  } catch (error) {
    console.error("Error loading internships:", error);
  }
}

// Update results text
function updateResultsCount() {
  const countElement = document.getElementById("results-count");
  if (countElement) {
    countElement.textContent = `${filteredInternships.length} Results Found`;
  }
}

// Render jobs for current page
function renderJobs() {
  const container = document.getElementById("jobs-container");
  container.innerHTML = "";

  const start = (currentPage - 1) * jobsPerPage;
  const end = start + jobsPerPage;
  const pageJobs = filteredInternships.slice(start, end);

  if (pageJobs.length === 0) {
    container.innerHTML = "<p>No internships available.</p>";
    return;
  }

  pageJobs.forEach(job => {
    const jobCard = document.createElement("div");
    jobCard.classList.add("job-card");
    jobCard.innerHTML = `
      <div class="job-info">
        <h4>${job.job_role || "Unknown Role"}</h4>
        <h2>${job.title || "No Title"}</h2>
        <div class="tags">
          <span>Type: ${job.internship_type || "N/A"}</span>
          <span>Mode: ${job.job_type || "N/A"}</span>
          <span>Salary: ${job.salary || "N/A"}</span>
        </div>
        <p>${job.overview || "No description available."}</p>
      </div>
      <button class="btn-secondary view-btn">View Job</button>
    `;

    // <-- UPDATED VIEW BUTTON HANDLER -->
    jobCard.querySelector(".view-btn").addEventListener("click", () => {
      const jobIndex = internships.indexOf(job); // get index in full internships array
      window.location.href = `view-job.html?id=${jobIndex}`; // redirect to separate page
    });

    container.appendChild(jobCard);
  });

  document.getElementById("page-info").textContent =
    `Page ${currentPage} of ${Math.ceil(filteredInternships.length / jobsPerPage)}`;

  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = end >= filteredInternships.length;
}


// Apply filters + search
function applyFiltersAndSearch() {
  const stateSelect = document.querySelector(".filter select").value.toLowerCase();
  const internshipTypes = Array.from(document.querySelectorAll(".filter input[name='internship_type']:checked"))
                        .map(cb => cb.value.toLowerCase());
  const jobTypes = Array.from(document.querySelectorAll(".filter input[name='job_type']:checked"))
                        .map(cb => cb.value.toLowerCase());
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();

  filteredInternships = internships.filter(job => {
    let matchesState = true;
    let matchesInternshipType = true;
    let matchesJobType = true;
    let matchesSearch = true;

    if (stateSelect && stateSelect !== "") {
      matchesState = job.location && job.location.toLowerCase().includes(stateSelect);
    }

    if (internshipTypes.length > 0) {
      matchesInternshipType = internshipTypes.includes(job.internship_type?.toLowerCase());
    }

    if (jobTypes.length > 0) {
      matchesJobType = jobTypes.includes(job.job_type?.toLowerCase());
    }

    if (searchTerm && searchTerm !== "") {
      matchesSearch = (job.title?.toLowerCase().includes(searchTerm) ||
                       job.job_role?.toLowerCase().includes(searchTerm));
    }

    return matchesState && matchesInternshipType && matchesJobType && matchesSearch;
  });

  currentPage = 1;
  updateResultsCount();
  renderJobs();
}

// Search suggestions
const searchInput = document.getElementById("searchInput");
const suggestionsList = document.getElementById("suggestions");
const searchBtn = document.getElementById("searchBtn");

function showSuggestions(value) {
  const searchTerm = value.toLowerCase();
  suggestionsList.innerHTML = "";

  if (searchTerm.length === 0) return;

  const matches = internships.filter(job => 
    job.title?.toLowerCase().includes(searchTerm) || 
    job.job_role?.toLowerCase().includes(searchTerm)
  ).slice(0, 5);

  matches.forEach(job => {
    const li = document.createElement("li");
    li.textContent = job.title || job.job_role;
    li.addEventListener("click", () => {
      searchInput.value = li.textContent;
      suggestionsList.innerHTML = "";
      applyFiltersAndSearch();
    });
    suggestionsList.appendChild(li);
  });
}

searchInput.addEventListener("input", () => showSuggestions(searchInput.value));
searchBtn.addEventListener("click", () => {
  applyFiltersAndSearch();
  suggestionsList.innerHTML = "";
});
document.addEventListener("click", (e) => {
  if (!searchInput.contains(e.target)) {
    suggestionsList.innerHTML = "";
  }
});

// Pagination
document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderJobs();
  }
});
document.getElementById("nextBtn").addEventListener("click", () => {
  if (currentPage * jobsPerPage < filteredInternships.length) {
    currentPage++;
    renderJobs();
  }
});

// Filter checkboxes and dropdown
document.querySelectorAll(".filter input[type='checkbox']").forEach(cb => {
  cb.addEventListener("change", applyFiltersAndSearch);
});
document.querySelector(".filter select").addEventListener("change", applyFiltersAndSearch);

// --- VIEW JOB FEATURE ---
function viewJob(job) {
  document.getElementById("job-list-page").style.display = "none";
  document.getElementById("job-view-page").style.display = "block";

  const details = document.getElementById("job-details");
  details.innerHTML = `
    <h2>${job.title || "No Title"}</h2>
    <h4>${job.job_role || "Unknown Role"}</h4>
    <div class="tags">
      <span>Type: ${job.internship_type || "N/A"}</span>
      <span>Mode: ${job.job_type || "N/A"}</span>
      <span>Salary: ${job.salary || "N/A"}</span>
      <span>Location: ${job.location || "N/A"}</span>
      <span>Duration: ${job.duration || "N/A"}</span>
      <span>Stipend: ${job.stipend || "N/A"}</span>
      <span>Posted On: ${job.posted_on || "N/A"}</span>
      <span>Company: ${job.company_name || "N/A"}</span>
    </div>
    <p><strong>Overview:</strong> ${job.overview || "No overview provided."}</p>
    <p><strong>Requirements:</strong> ${job.requirements || "Not specified."}</p>
    <p><strong>Responsibilities:</strong> ${job.responsibilities || "Not specified."}</p>
    <p><strong>Apply Link:</strong> <a href="${job.apply_link || "#"}" target="_blank">${job.apply_link || "N/A"}</a></p>
  `;

  // Suggested internships
  const suggestedContainer = document.getElementById("suggested-jobs");
  suggestedContainer.innerHTML = "";

  const otherJobs = internships.filter(j => j.title !== job.title).slice(0, 3);
  otherJobs.forEach(sug => {
    const card = document.createElement("div");
    card.classList.add("job-card");
    card.innerHTML = `
      <h4>${sug.job_role || "Unknown Role"}</h4>
      <h2>${sug.title || "No Title"}</h2>
      <div class="tags">
        <span>Type: ${sug.internship_type || "N/A"}</span>
        <span>Mode: ${sug.job_type || "N/A"}</span>
        <span>Salary: ${sug.salary || "N/A"}</span>
      </div>
      <button class="btn-secondary view-btn">View Job</button>
    `;
    card.querySelector(".view-btn").addEventListener("click", () => viewJob(sug));
    suggestedContainer.appendChild(card);
  });
}

// Back to listing
document.getElementById("backBtn").addEventListener("click", () => {
  document.getElementById("job-view-page").style.display = "none";
  document.getElementById("job-list-page").style.display = "block";
});

// Load internships on page load
loadInternships();
