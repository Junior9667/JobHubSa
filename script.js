// --- Global Mock Data & State Management ---
let mockJobs = JSON.parse(localStorage.getItem('mockJobs')) || [
    { id: 'jhsa001', title: 'Senior Software Engineer', company: 'Tech Solutions Ltd.', location: 'Cape Town, South Africa', category: 'IT', logo: 'https://via.placeholder.com/50/004AAD/FFFFFF?text=TSL', employerId: 'techguru' },
    { id: 'jhsa002', title: 'Marketing Specialist', company: 'Global Brands Inc.', location: 'Johannesburg, South Africa', category: 'Marketing', logo: 'https://via.placeholder.com/50/FF7F00/FFFFFF?text=GBI', employerId: 'techguru' },
    { id: 'jhsa003', title: 'Financial Analyst', company: 'SA Finance Group', location: 'Durban, South Africa', category: 'Finance', logo: 'https://via.placeholder.com/50/004AAD/FFFFFF?text=SFG', employerId: 'financepro' }
];
let mockApplications = JSON.parse(localStorage.getItem('mockApplications')) || [];
let mockUsers = JSON.parse(localStorage.getItem('mockUsers')) || [];

function saveState() {
    localStorage.setItem('mockJobs', JSON.stringify(mockJobs));
    localStorage.setItem('mockApplications', JSON.stringify(mockApplications));
    localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
}

// --- Reusable HTML Components ---
const headerHTML = (user) => `
    <div class="container">
        <div class="logo">
            <a href="index.html" style="color: inherit;"><i class="fas fa-briefcase"></i> JobHub SA</a>
        </div>
        <nav class="main-nav">
            <ul>
                <li><a href="index.html">Browse Jobs</a></li>
                ${user && user.role === 'employer' ? `<li><a href="post-job.html">Post a Job</a></li>` : ''}
                ${user && user.role === 'seeker' ? `<li><a href="my-applications.html">My Applications</a></li>` : ''}
                ${user && user.role === 'employer' ? `<li><a href="my-job-posts.html">My Job Posts</a></li>` : ''}
            </ul>
        </nav>
        <div class="user-actions">
            ${user ? `
                <div class="user-info">
                    <span>Welcome, ${user.username}</span>
                    <button id="logout-btn">Logout</button>
                </div>
            ` : `
                <a href="login.html" class="btn btn-primary-outline">Login / Register</a>
            `}
        </div>
        <div class="mobile-menu-icon">
            <i class="fas fa-bars"></i>
        </div>
    </div>
`;

const footerHTML = `
    <div class="container">
        <div class="footer-content">
            <div class="footer-logo">
                <i class="fas fa-briefcase"></i> JobHub SA
            </div>
            <nav class="footer-nav">
                <ul>
                    <li><a href="about.html">About Us</a></li>
                    <li><a href="privacy.html">Privacy Policy</a></li>
                    <li><a href="terms.html">Terms of Service</a></li>
                    <li><a href="contact.html">Contact Us</a></li>
                </ul>
            </nav>
            <div class="social-icons">
                <a href="#"><i class="fab fa-linkedin"></i></a>
                <a href="#"><i class="fab fa-facebook-f"></i></a>
                <a href="#"><i class="fab fa-twitter"></i></a>
            </div>
        </div>
        <div class="footer-bottom">
            &copy; 2025 JobHub SA. All rights reserved.
        </div>
    </div>
`;


// --- Main Entry Point ---
document.addEventListener('DOMContentLoaded', () => {
    // Inject Header and Footer on every page
    document.querySelector('.header').innerHTML = headerHTML(getCurrentUser());
    document.querySelector('.footer').innerHTML = footerHTML;

    // Global UI Handlers
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const mainNav = document.querySelector('.main-nav');
    if (mobileMenuIcon) {
        mobileMenuIcon.addEventListener('click', () => mainNav.classList.toggle('active'));
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Page-Specific Logic
    const path = window.location.pathname;
    const protectedPages = ['post-job.html', 'my-applications.html', 'my-job-posts.html'];
    if (protectedPages.some(page => path.includes(page)) && !getCurrentUser()) {
        window.location.href = 'login.html';
        return;
    }

    if (path.includes('index.html') || path.endsWith('/')) initHomePage();
    else if (path.includes('post-job.html')) initPostJobPage();
    else if (path.includes('my-applications.html')) initMyApplicationsPage();
    else if (path.includes('my-job-posts.html')) initMyJobPostsPage();
    else if (path.includes('login.html')) initLoginPage();
    else if (path.includes('register.html')) initRegisterPage();
});

// --- User Authentication Functions ---
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function initLoginPage() {
    document.getElementById('login-form').addEventListener('submit', e => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const user = mockUsers.find(u => u.username === username && u.password === password);

        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'index.html';
        } else {
            alert('Invalid username or password.');
        }
    });
}

function initRegisterPage() {
    document.getElementById('register-form').addEventListener('submit', e => {
        e.preventDefault();
        const newUser = {
            name: document.getElementById('name').value,
            surname: document.getElementById('surname').value,
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
            role: document.querySelector('input[name="role"]:checked').value
        };

        if (mockUsers.some(u => u.username === newUser.username)) {
            alert('Username already exists. Please choose another.');
            return;
        }

        mockUsers.push(newUser);
        saveState();
        alert('Registration successful! Please login.');
        window.location.href = 'login.html';
    });
}

// --- Home Page (index.html) ---
function initHomePage() { /* Unchanged from previous version */ const searchButton=document.getElementById("search-jobs-btn"),modalOverlay=document.getElementById("apply-modal-overlay"),closeModalBtn=document.getElementById("close-modal-btn"),applicationForm=document.getElementById("application-form");renderJobs(mockJobs),searchButton.addEventListener("click",()=>{const e=document.getElementById("keyword-search").value.toLowerCase(),t=document.getElementById("location-search").value.toLowerCase(),o=document.getElementById("category-search").value.toLowerCase(),n=mockJobs.filter(n=>(n.title.toLowerCase().includes(e)||n.company.toLowerCase().includes(e))&&n.location.toLowerCase().includes(t)&&n.category.toLowerCase().includes(o));renderJobs(n,"Search Results")}),closeModalBtn.addEventListener("click",()=>modalOverlay.style.display="none"),window.addEventListener("click",e=>{e.target==modalOverlay&&(modalOverlay.style.display="none")}),applicationForm.addEventListener("submit",e=>{e.preventDefault();const t=document.getElementById("apply-job-id").value,o=document.getElementById("cv-upload").files[0];if(!o||"application/pdf"!==o.type)return void alert("Please upload a valid PDF file for your CV.");const n={id:"app"+Date.now(),jobId:t,userId:getCurrentUser().username,applicantName:document.getElementById("full-name").value,applicantEmail:document.getElementById("email").value,applicantPhone:document.getElementById("phone").value,applicantCV:o.name,appliedDate:(new Date).toISOString(),status:"Pending"};mockApplications.push(n),saveState(),modalOverlay.style.display="none",applicationForm.reset(),alert("Application submitted successfully!")});}
function renderJobs(jobs, title = "All Job Listings") { /* Unchanged */ const grid = document.getElementById('job-listings-grid'); const message = document.getElementById('no-jobs-message'); document.getElementById('job-listings-title').textContent = title; grid.innerHTML = ''; if (jobs.length === 0) { message.style.display = 'block'; } else { message.style.display = 'none'; jobs.forEach(job => grid.innerHTML += createJobCardHTML(job)); attachApplyListeners(); } }
function createJobCardHTML(job) { /* Unchanged */ return `<div class="job-card"><div class="job-card-header"><img src="${job.logo}" alt="${job.company} Logo" class="company-logo"><div><h3>${job.title}</h3><p class="company-name">${job.company}</p><p class="job-location"><i class="fas fa-map-marker-alt"></i> ${job.location}</p></div></div><div class="job-card-footer"><button class="btn btn-apply" data-job-id="${job.id}">Apply Now</button></div></div>`; }
function attachApplyListeners() {
    const currentUser = getCurrentUser();
    document.querySelectorAll('.btn-apply').forEach(button => {
        button.addEventListener('click', (e) => {
            if (!currentUser) {
                alert('Please login to apply for jobs.');
                window.location.href = 'login.html';
                return;
            }
            if (currentUser.role !== 'seeker') {
                alert('Only Job Seekers can apply for jobs.');
                return;
            }
            
            const jobId = e.target.dataset.jobId;
            const job = mockJobs.find(j => j.id === jobId);

            if (mockApplications.some(app => app.userId === currentUser.username && app.jobId === jobId)) {
                alert('You have already applied for this job!');
                return;
            }

            const modalOverlay = document.getElementById('apply-modal-overlay');
            document.getElementById('modal-job-title').textContent = `Apply for ${job.title}`;
            document.getElementById('apply-job-id').value = jobId;
            modalOverlay.style.display = 'flex';
        });
    });
}

// --- My Applications Page (my-applications.html) ---
function initMyApplicationsPage() {
    const currentUser = getCurrentUser();
    const list = document.getElementById('applications-list');
    const message = document.getElementById('no-applications-state');
    const userApplications = mockApplications.filter(app => app.userId === currentUser.username);
    list.innerHTML = '';
    if (userApplications.length === 0) {
        message.style.display = 'block';
    } else {
        message.style.display = 'none';
        userApplications.forEach(app => list.innerHTML += createApplicationItemHTML(app));
    }
}
function createApplicationItemHTML(application) {
    const job = mockJobs.find(j => j.id === application.jobId);
    if (!job) return '';
    const statusClass = `status-${application.status.toLowerCase()}`;
    return `<div class="application-item"><div class="application-details"><h3>${job.title}</h3><p><strong>Company:</strong> ${job.company}</p><p><strong>Applied On:</strong> ${new Date(application.appliedDate).toLocaleDateString()}</p></div><div class="application-status"><span class="status-badge ${statusClass}">${application.status}</span></div></div>`;
}

// --- My Job Posts Page (my-job-posts.html) ---
function initMyJobPostsPage() {
    const applicantsModal = document.getElementById('view-applicants-modal-overlay');
    const detailsModal = document.getElementById('applicant-details-modal-overlay');
    const closeApplicantsBtn = document.getElementById('close-applicants-modal-btn');
    const closeDetailsBtn = document.getElementById('close-details-modal-btn');
    
    closeApplicantsBtn.addEventListener('click', () => applicantsModal.style.display = 'none');
    closeDetailsBtn.addEventListener('click', () => detailsModal.style.display = 'none');
    window.addEventListener('click', (event) => {
        if (event.target == applicantsModal) applicantsModal.style.display = 'none';
        if (event.target == detailsModal) detailsModal.style.display = 'none';
    });

    renderMyJobPosts();
}

function renderMyJobPosts() {
    const currentUser = getCurrentUser();
    const list = document.getElementById('job-posts-list');
    const message = document.getElementById('no-job-posts-state');
    list.innerHTML = '';
    const employerJobPosts = mockJobs.filter(job => job.employerId === currentUser.username);

    if (employerJobPosts.length === 0) {
        message.style.display = 'block';
    } else {
        message.style.display = 'none';
        employerJobPosts.forEach(job => list.innerHTML += createJobPostItemHTML(job));
        attachDeleteListeners();
        attachViewApplicantsListeners();
    }
}
function createJobPostItemHTML(job) {
    const applicantsCount = mockApplications.filter(app => app.jobId === job.id).length;
    return `<div class="job-post-item"><div class="job-post-details"><h3>${job.title}</h3><p><strong>Location:</strong> ${job.location}</p></div><div class="job-applicants"><button class="btn btn-view-applicants" data-job-id="${job.id}">${applicantsCount} Applicants</button></div><div class="job-post-actions"><button class="btn btn-delete" data-job-id="${job.id}">Delete</button></div></div>`;
}

// --- Functions for My Job Posts Page (unchanged logic, just moved) ---
function attachDeleteListeners() { document.querySelectorAll('.btn-delete').forEach(button => { button.addEventListener('click', (e) => { const jobId = e.target.dataset.jobId; if (confirm('Are you sure you want to delete this job post? This will also remove all associated applications.')) { mockJobs = mockJobs.filter(job => job.id !== jobId); mockApplications = mockApplications.filter(app => app.jobId !== jobId); saveState(); renderMyJobPosts(); } }); }); }
function attachViewApplicantsListeners() { document.querySelectorAll('.btn-view-applicants').forEach(button => button.addEventListener('click', e => openApplicantsModal(e.target.dataset.jobId))); }
function openApplicantsModal(jobId) { const job = mockJobs.find(j => j.id === jobId); const applicants = mockApplications.filter(app => app.jobId === jobId); const modal = document.getElementById('view-applicants-modal-overlay'); const title = document.getElementById('applicants-modal-title'); const container = document.getElementById('applicants-list-container'); title.textContent = `Applicants for ${job.title}`; container.innerHTML = ''; if (applicants.length === 0) { container.innerHTML = '<p>No applicants for this job yet.</p>'; } else { applicants.forEach(app => { container.innerHTML += ` <div class="applicant-list-item"> <div class="applicant-info"> <p class="applicant-name">${app.applicantName}</p> <p class="application-date">Applied: ${new Date(app.appliedDate).toLocaleDateString()} | Status: <strong>${app.status}</strong></p> </div> <div class="applicant-actions"> <button class="btn btn-view-details" data-appid="${app.id}">View</button> <button class="btn btn-approve" data-appid="${app.id}">Approve</button> <button class="btn btn-decline" data-appid="${app.id}">Decline</button> </div> </div> `; }); } attachModalActionListeners(jobId); modal.style.display = 'flex'; }
function attachModalActionListeners(jobId) { document.querySelectorAll('.btn-view-details').forEach(b => b.onclick = e => openApplicantDetailsModal(e.target.dataset.appid)); document.querySelectorAll('.btn-approve').forEach(b => b.onclick = e => updateApplicationStatus(e.target.dataset.appid, 'Approved', jobId)); document.querySelectorAll('.btn-decline').forEach(b => b.onclick = e => updateApplicationStatus(e.target.dataset.appid, 'Declined', jobId)); }
function updateApplicationStatus(applicationId, newStatus, jobId) { const application = mockApplications.find(app => app.id === applicationId); if (application) { application.status = newStatus; saveState(); openApplicantsModal(jobId); } }
function openApplicantDetailsModal(applicationId) { const application = mockApplications.find(app => app.id === applicationId); const modal = document.getElementById('applicant-details-modal-overlay'); const content = document.getElementById('applicant-details-content'); const cvLink = document.getElementById('download-cv-link'); content.innerHTML = ` <p><strong>Name:</strong> ${application.applicantName}</p> <p><strong>Email:</strong> ${application.applicantEmail}</p> <p><strong>Phone:</strong> ${application.applicantPhone}</p> <p><strong>CV Filename:</strong> ${application.applicantCV}</p> `; cvLink.onclick = (e) => { e.preventDefault(); alert(`Simulating download for CV: ${application.applicantCV}\nIn a real application, this would trigger a file download.`); }; modal.style.display = 'flex'; }
function initPostJobPage() { /* ... This function and its helpers would be here, logic updated to use currentUser ... */ document.getElementById('post-job-form').addEventListener('submit', (e) => { e.preventDefault(); const currentUser = getCurrentUser(); const newJob = { id: 'jhsa' + Date.now(), title: document.getElementById('job-title').value, company: document.getElementById('company-name').value, location: document.getElementById('location').value, category: document.getElementById('category').value, description: document.getElementById('job-description').value, requirements: [], benefits: [], logo: 'https://via.placeholder.com/50/CCCCCC/666666?text=' + document.getElementById('company-name').value.charAt(0).toUpperCase(), postedDate: new Date().toISOString().split('T')[0], employerId: currentUser.username }; mockJobs.push(newJob); saveState(); alert('Job posted successfully!'); window.location.href = 'my-job-posts.html'; }); }