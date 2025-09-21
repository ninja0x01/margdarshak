 let internships = [];

    // Get job ID from URL query param
    function getJobId() {
      const params = new URLSearchParams(window.location.search);
      return params.get("id");
    }

    // Load JSON and display selected internship
    async function loadJob() {
      try {
        console.log("🔍 Starting to load internships...");
        const res = await fetch("resources/js/internships_dataset_large.json");
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        internships = await res.json();
        console.log("✅ Loaded internships:", internships.length, "items");

        const jobId = getJobId();
        console.log("🔎 Looking for job ID:", jobId);
        
        if (!jobId) {
          document.querySelector(".job-details-main").innerHTML = "<p>❌ No job ID provided in URL. Please add ?id=0 to the URL.</p>";
          return;
        }
        
        if (!internships[jobId]) {
          document.querySelector(".job-details-main").innerHTML = `<p>❌ Job with ID ${jobId} not found. Available jobs: 0-${internships.length-1}</p>`;
          return;
        }
        
        console.log("✅ Found job:", internships[jobId]);

        const job = internships[jobId];

        // Update job header
        document.querySelector(".company-avatar").textContent = (job.company_name || "CI").substring(0, 2).toUpperCase();
        document.querySelector(".job-title-section h1").textContent = job.title || "No Title";
        document.querySelector(".job-title-section h2").textContent = job.job_role || "Unknown Role";

        // Update job meta information
        const metaItems = document.querySelectorAll('.job-meta-item');
        if (metaItems.length >= 6) {
          metaItems[0].querySelector('.job-meta-value').textContent = job.internship_type || "N/A";
          metaItems[1].querySelector('.job-meta-value').textContent = job.job_type || "N/A";
          metaItems[2].querySelector('.job-meta-value').textContent = job.salary || "N/A";
          metaItems[3].querySelector('.job-meta-value').textContent = job.location || "N/A";
          metaItems[4].querySelector('.job-meta-value').textContent = job.duration || "Not specified";
          metaItems[5].querySelector('.job-meta-value').textContent = job.posted_on || "Recently";
        }

        // Update job sections
        const sections = document.querySelectorAll('.job-section');
        if (sections.length >= 3) {
          // Overview section
          sections[0].querySelector('p').textContent = job.overview || "No overview provided.";
          
          // Requirements section
          const requirements = job.requirements || [];
          const reqList = sections[1].querySelector('ul');
          
          if (Array.isArray(requirements) && requirements.length > 0) {
            reqList.innerHTML = requirements.map(req => `<li>${req}</li>`).join('');
          } else if (typeof requirements === 'string' && requirements.trim()) {
            const reqItems = requirements.split(',').map(req => req.trim());
            reqList.innerHTML = reqItems.map(req => `<li>${req}</li>`).join('');
          } else {
            reqList.innerHTML = '<li>Not specified</li>';
          }
          
          // Skills & Experience section (using skills_experience from your JSON)
          const skillsExp = job.skills_experience || job.responsibilities || [];
          const respList = sections[2].querySelector('ul');
          // Update section title to match the content
          sections[2].querySelector('h3').textContent = 'Skills & Experience';
          
          if (Array.isArray(skillsExp) && skillsExp.length > 0) {
            respList.innerHTML = skillsExp.map(skill => `<li>${skill}</li>`).join('');
          } else if (typeof skillsExp === 'string' && skillsExp.trim()) {
            const skillItems = skillsExp.split(',').map(skill => skill.trim());
            respList.innerHTML = skillItems.map(skill => `<li>${skill}</li>`).join('');
          } else {
            respList.innerHTML = '<li>Not specified</li>';
          }
        }

        const applyLinks = document.querySelectorAll('.apply-link, .apply-button');
applyLinks.forEach(link => {
  if (job.apply_link && job.apply_link !== "N/A") {
    link.href = job.apply_link;
    link.onclick = null;
  } else {
    link.href = "apply.html";  // redirect file
    link.onclick = null;        // remove alert/preventDefault
  }
});


        // Update sidebar details
        const sidebarItems = document.querySelectorAll('.job-details-item');
        if (sidebarItems.length >= 5) {
          sidebarItems[0].querySelector('.job-details-value').textContent = job.posted_on || "Recently";
          sidebarItems[1].querySelector('.job-details-value').textContent = job.internship_type || "Internship";
          sidebarItems[2].querySelector('.job-details-value').textContent = "Entry Level";
          sidebarItems[3].querySelector('.job-details-value').textContent = job.domain || "Technology";
          sidebarItems[4].querySelector('.job-details-value').textContent = job.company_name || "Not specified";
        }

        // Load suggested internships
        loadSuggestedJobs(jobId);

      } catch (error) {
        console.error("❌ Error loading internships:", error);
        
        let errorMessage = "<h3>🚨 Loading Error</h3>";
        if (error.message.includes('HTTP error')) {
          errorMessage += `<p><strong>File not found:</strong> Make sure 'internships_dataset_large.json' exists in the same folder as this HTML file.</p>`;
        } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
          errorMessage += `<p><strong>CORS Error:</strong> You need to run this on a local server, not open the file directly.</p>
                          <p><strong>Solutions:</strong></p>
                          <ul>
                            <li>Use VS Code Live Server extension</li>
                            <li>Run: <code>python -m http.server 8000</code></li>
                            <li>Run: <code>npx serve .</code></li>
                          </ul>`;
        } else {
          errorMessage += `<p><strong>Error:</strong> ${error.message}</p>`;
        }
        
        document.querySelector(".job-details-main").innerHTML = errorMessage;
      }
    }

    // Load suggested internships
    function loadSuggestedJobs(currentJobId) {
      const suggestedContainer = document.querySelector(".suggested-jobs");
      suggestedContainer.innerHTML = "";
      const otherJobs = internships.filter((j, idx) => idx != currentJobId).slice(0, 3);

      otherJobs.forEach(sug => {
        const card = document.createElement("div");
        card.classList.add("suggested-job-card");
        
        const sugIndex = internships.indexOf(sug);
        const category = sug.domain || sug.job_role || "Internship";
        const title = sug.title || "No Title";
        const type = sug.internship_type || "N/A";
        const mode = sug.job_type || "N/A";
        const salary = sug.salary || "N/A";

        card.innerHTML = `
          <div class="suggested-job-category">${category}</div>
          <h3 class="suggested-job-title">${title}</h3>
          <p class="suggested-job-meta">Type: ${type} • Mode: ${mode} • Salary: ${salary}</p>
        `;
        
        // Add click handler to navigate to job
        card.addEventListener("click", () => {
          window.location.href = `view-job.html?id=${sugIndex}`;
        });
        
        suggestedContainer.appendChild(card);
      });
    }

    // Back button functionality
    document.getElementById("backBtn").addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "index.html";
    });

    // Load job on page load
    document.addEventListener('DOMContentLoaded', loadJob);