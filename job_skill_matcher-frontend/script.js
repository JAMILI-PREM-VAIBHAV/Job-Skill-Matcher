// ===========================================================================
// Config
// ===========================================================================

// When the page is served by the backend (http://localhost:3000) API calls go
// to the same origin. When index.html is opened directly from disk, fall back
// to the local backend.
const API_BASE = window.location.protocol === 'file:' ? 'http://localhost:3000' : '';

const state = {
    jobs: [],
    savedJobIds: new Set(JSON.parse(localStorage.getItem('savedJobs') || '[]'))
};

let revealObserver;

document.addEventListener('DOMContentLoaded', () => {
    initRevealAnimations();
    initNavigation();
    initResumeUpload();
    initJobFilters();
    initContactForm();
    initSubscribeForm();
    document.getElementById('year').textContent = new Date().getFullYear();
    loadJobs();
});

// ===========================================================================
// Helpers
// ===========================================================================

/** Escapes text so it can be safely inserted into innerHTML. */
function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Calls the backend and returns the parsed JSON body. Throws an Error with a
 * user-friendly message if the server is unreachable or returns an error.
 */
async function api(path, options = {}) {
    let response;
    try {
        response = await fetch(API_BASE + path, options);
    } catch {
        throw new Error('Cannot reach the server. Make sure the backend is running (npm start).');
    }

    let body = null;
    try {
        body = await response.json();
    } catch {
        // Non-JSON response; handled below.
    }

    if (!response.ok || !body || body.success === false) {
        throw new Error(body?.message || `Request failed (${response.status}).`);
    }
    return body;
}

function postJson(path, data) {
    return api(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

/** Disables a submit button and shows a spinner until `task` settles. */
async function withLoadingButton(button, loadingText, task) {
    const original = button.innerHTML;
    button.disabled = true;
    button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${escapeHtml(loadingText)}`;
    try {
        return await task();
    } finally {
        button.disabled = false;
        button.innerHTML = original;
    }
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-leaving');
        toast.addEventListener('animationend', () => toast.remove(), { once: true });
    }, 3500);
}

// ===========================================================================
// Navigation
// ===========================================================================

function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    document.getElementById('exploreJobsBtn').addEventListener('click', () => {
        document.getElementById('jobs').scrollIntoView({ behavior: 'smooth' });
    });
}

// ===========================================================================
// Jobs
// ===========================================================================

async function loadJobs() {
    const container = document.getElementById('jobCards');
    container.innerHTML = `
        <div class="no-jobs">
            <i class="fas fa-spinner fa-spin"></i>
            <h3>Loading jobs...</h3>
        </div>`;

    try {
        const { data } = await api('/api/jobs');
        state.jobs = data;
        renderJobCards(currentFilteredJobs());
    } catch (err) {
        container.innerHTML = `
            <div class="no-jobs">
                <i class="fas fa-plug"></i>
                <h3>Couldn't load jobs</h3>
                <p>${escapeHtml(err.message)}</p>
                <button class="btn-secondary" id="retryJobsBtn">Try again</button>
            </div>`;
        document.getElementById('retryJobsBtn').addEventListener('click', loadJobs);
    }
}

function currentFilteredJobs() {
    const active = document.querySelector('.filter-btn.active');
    const filter = active ? active.dataset.filter : 'all';
    return filter === 'all' ? state.jobs : state.jobs.filter(job => job.category === filter);
}

function initJobFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderJobCards(currentFilteredJobs());
        });
    });
}

function renderJobCards(jobs) {
    const container = document.getElementById('jobCards');

    if (jobs.length === 0) {
        container.innerHTML = `
            <div class="no-jobs">
                <i class="fas fa-search"></i>
                <h3>No Jobs Found</h3>
                <p>Try a different category.</p>
            </div>`;
        return;
    }

    container.innerHTML = jobs.map(job => {
        const saved = state.savedJobIds.has(job.id);
        return `
        <div class="job-card ${escapeHtml(job.category)}">
            <div class="job-header">
                <span class="job-category-badge ${escapeHtml(job.category)}-badge">${escapeHtml(job.category)}</span>
                <h3 class="job-title">${escapeHtml(job.title)}</h3>
                <p class="job-company">${escapeHtml(job.company)}</p>
                <div class="job-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(job.location)}</span>
                    <span><i class="fas fa-clock"></i> ${escapeHtml(job.type)}</span>
                    <span><i class="fas fa-calendar"></i> ${escapeHtml(job.posted)}</span>
                </div>
            </div>
            <div class="job-body">
                <p class="job-description">${escapeHtml(job.description)}</p>
                <div class="job-skills">
                    ${job.skills.map(skill => `<span class="job-skill">${escapeHtml(skill)}</span>`).join('')}
                </div>
            </div>
            <div class="job-footer">
                <span class="job-salary">${escapeHtml(job.salary)}</span>
                <div class="job-actions">
                    <button class="save-btn ${saved ? 'saved' : ''}" data-id="${job.id}"
                            title="${saved ? 'Remove from saved' : 'Save job'}" aria-pressed="${saved}">
                        <i class="${saved ? 'fas' : 'far'} fa-bookmark"></i>
                    </button>
                    <button class="apply-btn" data-id="${job.id}">
                        <i class="fas fa-paper-plane"></i>
                        Apply Now
                    </button>
                </div>
            </div>
        </div>`;
    }).join('');

    container.querySelectorAll('.apply-btn').forEach(button => {
        button.addEventListener('click', () => {
            const job = state.jobs.find(j => j.id === Number(button.dataset.id));
            if (job) showApplicationModal(job);
        });
    });

    container.querySelectorAll('.save-btn').forEach(button => {
        button.addEventListener('click', () => {
            const job = state.jobs.find(j => j.id === Number(button.dataset.id));
            if (job) toggleSaveJob(job, button);
        });
    });

    container.querySelectorAll('.job-card').forEach(card => revealObserver.observe(card));
}

function toggleSaveJob(job, button) {
    const icon = button.querySelector('i');
    const nowSaved = !state.savedJobIds.has(job.id);

    if (nowSaved) state.savedJobIds.add(job.id);
    else state.savedJobIds.delete(job.id);
    localStorage.setItem('savedJobs', JSON.stringify([...state.savedJobIds]));

    button.classList.toggle('saved', nowSaved);
    button.setAttribute('aria-pressed', nowSaved);
    button.title = nowSaved ? 'Remove from saved' : 'Save job';
    icon.classList.toggle('fas', nowSaved);
    icon.classList.toggle('far', !nowSaved);

    showToast(nowSaved ? `Saved: ${job.title}` : `Removed: ${job.title}`, nowSaved ? 'success' : 'info');
}

// ===========================================================================
// Job application modal
// ===========================================================================

function showApplicationModal(job) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content modal-narrow" role="dialog" aria-modal="true" aria-labelledby="applyTitle">
            <span class="close" aria-label="Close">&times;</span>
            <h2 id="applyTitle">Apply for ${escapeHtml(job.title)}</h2>
            <p><strong>Company:</strong> ${escapeHtml(job.company)}</p>
            <p><strong>Location:</strong> ${escapeHtml(job.location)}</p>
            <p><strong>Salary:</strong> ${escapeHtml(job.salary)}</p>

            <form class="application-form" novalidate>
                <div class="form-group">
                    <label for="applicantName">Full Name</label>
                    <input type="text" id="applicantName" name="name" placeholder="Enter your full name" required>
                </div>
                <div class="form-group">
                    <label for="applicantEmail">Email</label>
                    <input type="email" id="applicantEmail" name="email" placeholder="Enter your email" required>
                </div>
                <div class="form-group">
                    <label for="applicantResume">Upload Resume (PDF or .docx, max 5MB)</label>
                    <input type="file" id="applicantResume" name="resume" accept=".pdf,.docx" required>
                </div>
                <div class="form-group">
                    <label for="coverLetter">Cover Letter</label>
                    <textarea id="coverLetter" name="coverLetter" rows="4" placeholder="Why are you interested in this position?" required></textarea>
                </div>
                <button type="submit" class="btn-primary btn-block">Submit Application</button>
            </form>
        </div>`;

    document.body.appendChild(modal);
    document.body.classList.add('modal-open');
    modal.querySelector('#applicantName').focus();

    const close = () => {
        modal.remove();
        document.removeEventListener('keydown', onKeydown);
        if (!document.querySelector('.modal[style*="block"]')) document.body.classList.remove('modal-open');
    };
    const onKeydown = e => { if (e.key === 'Escape') close(); };

    modal.querySelector('.close').addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    document.addEventListener('keydown', onKeydown);

    const form = modal.querySelector('form');
    form.addEventListener('submit', async e => {
        e.preventDefault();
        if (!form.reportValidity()) return;

        const formData = new FormData(form);
        formData.append('jobId', job.id);

        try {
            const result = await withLoadingButton(form.querySelector('button[type="submit"]'), 'Submitting...', () =>
                api('/api/apply', { method: 'POST', body: formData })
            );
            showToast(result.message, 'success');
            close();
        } catch (err) {
            showToast(err.message, 'error');
        }
    });
}

// ===========================================================================
// Resume upload & analysis
// ===========================================================================

const ACCEPTED_EXTENSIONS = ['.pdf', '.docx'];
const MAX_RESUME_SIZE = 5 * 1024 * 1024;

function initResumeUpload() {
    const modal = document.getElementById('uploadModal');
    const uploadArea = document.getElementById('uploadArea');
    const resumeInput = document.getElementById('resumeInput');

    const open = () => {
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
    };
    const close = () => {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        resetUploadResult();
    };

    document.getElementById('uploadBtn').addEventListener('click', open);
    modal.querySelector('.close').addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.style.display === 'block') close();
    });

    // The browse button is re-rendered, so listen on the container instead.
    uploadArea.addEventListener('click', e => {
        if (e.target.closest('#browseBtn')) resumeInput.click();
    });

    resumeInput.addEventListener('change', () => {
        if (resumeInput.files[0]) handleResumeUpload(resumeInput.files[0]);
        resumeInput.value = ''; // allow re-selecting the same file
    });

    uploadArea.addEventListener('dragover', e => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
    uploadArea.addEventListener('drop', e => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        if (e.dataTransfer.files[0]) handleResumeUpload(e.dataTransfer.files[0]);
    });
}

function setUploadAreaIdle(message = 'Drag & Drop your resume here') {
    document.getElementById('uploadArea').innerHTML = `
        <i class="fas fa-cloud-upload-alt"></i>
        <p>${escapeHtml(message)}</p>
        <p>or</p>
        <button class="btn-primary" id="browseBtn" type="button">Browse Files</button>
        <p class="upload-hint">PDF or Word (.docx), up to 5MB</p>`;
}

async function handleResumeUpload(file) {
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
        showToast('Please upload a PDF or Word (.docx) document.', 'error');
        return;
    }
    if (file.size > MAX_RESUME_SIZE) {
        showToast('File too large. Maximum size is 5MB.', 'error');
        return;
    }

    const uploadArea = document.getElementById('uploadArea');
    document.getElementById('uploadResult').style.display = 'none';
    uploadArea.innerHTML = `<i class="fas fa-spinner fa-spin"></i><p>Analyzing ${escapeHtml(file.name)}...</p>`;

    const formData = new FormData();
    formData.append('resume', file);

    try {
        const { data } = await api('/api/analyze-resume', { method: 'POST', body: formData });
        setUploadAreaIdle('Want to try another resume? Drop it here');
        displayUploadResult(data);
    } catch (err) {
        setUploadAreaIdle('Drag & Drop your resume here');
        showToast(err.message, 'error');
    }
}

function displayUploadResult({ skills, jobRecommendations, courseRecommendations }) {
    const skillList = document.getElementById('skillList');
    const jobList = document.getElementById('jobRecommendations');
    const courseList = document.getElementById('courseRecommendations');

    skillList.innerHTML = skills.length
        ? skills.map(skill => `<span class="skill-tag">${escapeHtml(skill)}</span>`).join('')
        : '<p class="empty-note">We couldn\'t find any skills we recognise. Try listing your skills clearly in a "Skills" section.</p>';

    jobList.innerHTML = jobRecommendations.length
        ? jobRecommendations.map(job => `
            <div class="recommendation-item">
                <div class="recommendation-header">
                    <h4>${escapeHtml(job.title)}</h4>
                    <span class="match-badge ${matchLevel(job.match)}">${job.match}% match</span>
                </div>
                <p>${escapeHtml(job.company)} &bull; ${escapeHtml(job.location)}</p>
                <p class="skill-breakdown">
                    <span class="have"><i class="fas fa-check"></i> ${job.matchingSkills.map(escapeHtml).join(', ')}</span>
                    ${job.missingSkills.length ? `<span class="missing"><i class="fas fa-times"></i> ${job.missingSkills.map(escapeHtml).join(', ')}</span>` : ''}
                </p>
                <button class="btn-primary btn-small apply-recommendation-btn" data-id="${job.id}">Apply</button>
            </div>`).join('')
        : '<p class="empty-note">No matching jobs yet. The courses below can help you build in-demand skills.</p>';

    courseList.innerHTML = courseRecommendations.length
        ? courseRecommendations.map(course => `
            <div class="recommendation-item">
                <h4>${escapeHtml(course.title)}</h4>
                <p>${escapeHtml(course.provider)} &bull; ${escapeHtml(course.duration)} &bull; ${escapeHtml(course.level)} &bull; ${escapeHtml(course.price)}
                   &bull; <i class="fas fa-star"></i> ${course.rating}</p>
                ${course.teachesSkills.length ? `<p class="skill-breakdown"><span class="learn">Learn: ${course.teachesSkills.map(escapeHtml).join(', ')}</span></p>` : ''}
                <a class="btn-secondary btn-small" href="${escapeHtml(course.url)}" target="_blank" rel="noopener noreferrer">View Course</a>
            </div>`).join('')
        : '<p class="empty-note">You already have every skill our courses teach. Nice!</p>';

    jobList.querySelectorAll('.apply-recommendation-btn').forEach(button => {
        button.addEventListener('click', () => {
            const job = jobRecommendations.find(j => j.id === Number(button.dataset.id));
            if (job) showApplicationModal(job);
        });
    });

    const uploadResult = document.getElementById('uploadResult');
    uploadResult.style.display = 'block';
    uploadResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function matchLevel(percent) {
    if (percent >= 70) return 'match-high';
    if (percent >= 40) return 'match-medium';
    return 'match-low';
}

function resetUploadResult() {
    document.getElementById('uploadResult').style.display = 'none';
    setUploadAreaIdle();
}

// ===========================================================================
// Contact & subscribe forms
// ===========================================================================

function initContactForm() {
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const data = {
            name: form.querySelector('#name').value,
            email: form.querySelector('#email').value,
            message: form.querySelector('#message').value
        };

        try {
            const result = await withLoadingButton(form.querySelector('button[type="submit"]'), 'Sending...', () =>
                postJson('/api/contact', data)
            );
            showToast(result.message, 'success');
            form.reset();
        } catch (err) {
            showToast(err.message, 'error');
        }
    });
}

function initSubscribeForm() {
    const form = document.querySelector('.subscribe-form');
    form.addEventListener('submit', async e => {
        e.preventDefault();
        try {
            const result = await withLoadingButton(form.querySelector('button'), '', () =>
                postJson('/api/subscribe', { email: form.querySelector('input').value })
            );
            showToast(result.message, 'success');
            form.reset();
        } catch (err) {
            showToast(err.message, 'error');
        }
    });
}

// ===========================================================================
// Scroll reveal animations
// ===========================================================================

function initRevealAnimations() {
    revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.about-card, .skill-category, .team-card')
        .forEach(el => revealObserver.observe(el));
}
