// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

// Initialize the application
function initApp() {
    // Initialize job listings
    initJobs();
    
    // Initialize event listeners
    initEventListeners();
    
    // Initialize animations
    initAnimations();
}

// Initialize job listings
function initJobs() {
    // Sample job data
    const jobs = [
        {
            id: 1,
            title: "Frontend Developer",
            company: "TechCorp Inc.",
            location: "San Francisco, CA",
            type: "Full-time",
            category: "tech",
            description: "We are looking for a skilled Frontend Developer to join our team. You will be responsible for building responsive web applications using modern JavaScript frameworks.",
            skills: ["JavaScript", "React", "HTML", "CSS", "TypeScript", "Redux"],
            salary: "$90,000 - $120,000",
            posted: "2 days ago"
        },
        {
            id: 2,
            title: "UX/UI Designer",
            company: "DesignStudio",
            location: "Remote",
            type: "Full-time",
            category: "design",
            description: "Join our design team to create beautiful and intuitive user interfaces for our products. Work closely with product managers and developers.",
            skills: ["Figma", "UI Design", "UX Research", "Prototyping", "Wireframing"],
            salary: "$75,000 - $100,000",
            posted: "1 week ago"
        },
        {
            id: 3,
            title: "Data Analyst",
            company: "DataInsights",
            location: "New York, NY",
            type: "Full-time",
            category: "business",
            description: "Analyze complex datasets to provide insights that drive business decisions. Create dashboards and reports for stakeholders.",
            skills: ["SQL", "Python", "Data Visualization", "Statistics", "Excel", "Tableau"],
            salary: "$80,000 - $110,000",
            posted: "3 days ago"
        },
        {
            id: 4,
            title: "Digital Marketing Specialist",
            company: "MarketGrow",
            location: "Chicago, IL",
            type: "Full-time",
            category: "marketing",
            description: "Develop and implement digital marketing strategies to increase brand awareness and drive sales across multiple channels.",
            skills: ["SEO", "Content Marketing", "Social Media", "Google Analytics", "Email Marketing"],
            salary: "$65,000 - $85,000",
            posted: "5 days ago"
        },
        {
            id: 5,
            title: "Backend Developer",
            company: "ServerTech",
            location: "Austin, TX",
            type: "Full-time",
            category: "tech",
            description: "Build scalable server-side applications and APIs for our platform. Work with modern cloud technologies and microservices architecture.",
            skills: ["Node.js", "Python", "MongoDB", "AWS", "Docker", "Redis"],
            salary: "$95,000 - $130,000",
            posted: "1 day ago"
        },
        {
            id: 6,
            title: "Product Manager",
            company: "ProductLabs",
            location: "Boston, MA",
            type: "Full-time",
            category: "business",
            description: "Lead product development from conception to launch, working with cross-functional teams to deliver exceptional user experiences.",
            skills: ["Product Strategy", "Agile", "User Research", "Roadmapping", "Analytics", "JIRA"],
            salary: "$100,000 - $140,000",
            posted: "4 days ago"
        },
        {
            id: 7,
            title: "Graphic Designer",
            company: "CreativeMinds",
            location: "Los Angeles, CA",
            type: "Contract",
            category: "design",
            description: "Create visual concepts to communicate ideas that inspire, inform, and captivate consumers across various media platforms.",
            skills: ["Adobe Creative Suite", "Illustration", "Branding", "Typography", "Layout", "Photoshop"],
            salary: "$60,000 - $80,000",
            posted: "2 weeks ago"
        },
        {
            id: 8,
            title: "SEO Specialist",
            company: "SearchOptimize",
            location: "Remote",
            type: "Full-time",
            category: "marketing",
            description: "Optimize website content and structure to improve search engine rankings and drive organic traffic through data-driven strategies.",
            skills: ["SEO", "Keyword Research", "Content Strategy", "Google Analytics", "Technical SEO", "Ahrefs"],
            salary: "$70,000 - $90,000",
            posted: "6 days ago"
        },
        {
            id: 9,
            title: "DevOps Engineer",
            company: "CloudSystems",
            location: "Seattle, WA",
            type: "Full-time",
            category: "tech",
            description: "Implement and maintain CI/CD pipelines and cloud infrastructure for our applications. Ensure high availability and performance.",
            skills: ["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform", "Linux"],
            salary: "$110,000 - $150,000",
            posted: "3 days ago"
        },
        {
            id: 10,
            title: "Content Strategist",
            company: "ContentFirst",
            location: "Remote",
            type: "Full-time",
            category: "marketing",
            description: "Develop content strategies that engage audiences and drive business goals across multiple platforms and channels.",
            skills: ["Content Strategy", "SEO", "Copywriting", "Analytics", "Social Media", "CMS"],
            salary: "$70,000 - $95,000",
            posted: "1 week ago"
        }
    ];
    
    // Store jobs globally for filtering
    window.allJobs = jobs;
    
    // Render job cards
    renderJobCards(jobs);
    
    // Set up job filtering
    setupJobFiltering();
}

// Render job cards
function renderJobCards(jobs) {
    const jobCards = document.getElementById('jobCards');
    jobCards.innerHTML = '';
    
    if (jobs.length === 0) {
        jobCards.innerHTML = `
            <div class="no-jobs">
                <i class="fas fa-search"></i>
                <h3>No Jobs Found</h3>
                <p>Try adjusting your filters or search criteria</p>
            </div>
        `;
        return;
    }
    
    jobs.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.className = `job-card ${job.category}`;
        jobCard.innerHTML = `
            <div class="job-header">
                <span class="job-category-badge ${job.category}-badge">${job.category}</span>
                <h3 class="job-title">${job.title}</h3>
                <p class="job-company">${job.company}</p>
                <div class="job-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                    <span><i class="fas fa-clock"></i> ${job.type}</span>
                    <span><i class="fas fa-calendar"></i> ${job.posted}</span>
                </div>
            </div>
            <div class="job-body">
                <p class="job-description">${job.description}</p>
                <div class="job-skills">
                    ${job.skills.map(skill => `<span class="job-skill">${skill}</span>`).join('')}
                </div>
            </div>
            <div class="job-footer">
                <span class="job-salary">${job.salary}</span>
                <div class="job-actions">
                    <button class="save-btn" data-id="${job.id}" title="Save Job">
                        <i class="far fa-bookmark"></i>
                    </button>
                    <button class="apply-btn" data-id="${job.id}">
                        <i class="fas fa-paper-plane"></i>
                        Apply Now
                    </button>
                </div>
            </div>
        `;
        jobCards.appendChild(jobCard);
    });
    
    // Add event listeners to apply buttons
    document.querySelectorAll('.apply-btn').forEach(button => {
        button.addEventListener('click', function() {
            const jobId = this.getAttribute('data-id');
            const job = window.allJobs.find(j => j.id == jobId);
            if (job) {
                showApplicationModal(job);
            }
        });
    });
    
    // Add event listeners to save buttons
    document.querySelectorAll('.save-btn').forEach(button => {
        button.addEventListener('click', function() {
            const jobId = this.getAttribute('data-id');
            const job = window.allJobs.find(j => j.id == jobId);
            if (job) {
                toggleSaveJob(job, this);
            }
        });
    });
}

// Show application modal
function showApplicationModal(job) {
    // Create modal for job application
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <span class="close">&times;</span>
            <h2>Apply for ${job.title}</h2>
            <p><strong>Company:</strong> ${job.company}</p>
            <p><strong>Location:</strong> ${job.location}</p>
            <p><strong>Salary:</strong> ${job.salary}</p>
            
            <form id="applicationForm" style="margin-top: 20px;">
                <div class="form-group">
                    <label for="applicantName">Full Name</label>
                    <input type="text" id="applicantName" placeholder="Enter your full name" required>
                </div>
                <div class="form-group">
                    <label for="applicantEmail">Email</label>
                    <input type="email" id="applicantEmail" placeholder="Enter your email" required>
                </div>
                <div class="form-group">
                    <label for="applicantResume">Upload Resume</label>
                    <input type="file" id="applicantResume" accept=".pdf,.doc,.docx" required>
                </div>
                <div class="form-group">
                    <label for="coverLetter">Cover Letter</label>
                    <textarea id="coverLetter" rows="4" placeholder="Why are you interested in this position?" required></textarea>
                </div>
                <button type="submit" class="btn-primary" style="width: 100%; margin-top: 20px;">
                    Submit Application
                </button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(modal);
    });
    
    // Close when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Form submission
    const form = modal.querySelector('#applicationForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert(`Application submitted for ${job.title} at ${job.company}!`);
        document.body.removeChild(modal);
    });
}

// Toggle save job
function toggleSaveJob(job, button) {
    const icon = button.querySelector('i');
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        button.style.color = 'var(--primary-color)';
        button.style.borderColor = 'var(--primary-color)';
        showToast(`Saved: ${job.title}`, 'success');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        button.style.color = 'var(--gray-color)';
        button.style.borderColor = 'var(--light-gray)';
        showToast(`Removed: ${job.title}`, 'info');
    }
}

// Show toast notification
function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-color)' : 'var(--primary-color)'};
        color: white;
        padding: 12px 20px;
        border-radius: var(--border-radius);
        box-shadow: var(--box-shadow);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Set up job filtering
function setupJobFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter category
            const filter = this.getAttribute('data-filter');
            
            // Filter jobs
            let filteredJobs;
            if (filter === 'all') {
                filteredJobs = window.allJobs;
            } else {
                filteredJobs = window.allJobs.filter(job => job.category === filter);
            }
            
            // Render filtered jobs
            renderJobCards(filteredJobs);
        });
    });
}

// Rest of the JavaScript remains the same as previous version...
// (initEventListeners, handleResumeUpload, displayUploadResult, resetUploadResult, initAnimations functions)

// Initialize event listeners
function initEventListeners() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Resume upload modal
    const uploadBtn = document.getElementById('uploadBtn');
    const exploreJobsBtn = document.getElementById('exploreJobsBtn');
    const modal = document.getElementById('uploadModal');
    const closeBtn = document.querySelector('.close');
    const uploadArea = document.getElementById('uploadArea');
    const browseBtn = document.getElementById('browseBtn');
    const resumeInput = document.getElementById('resumeInput');
    
    // Open modal
    uploadBtn.addEventListener('click', function() {
        modal.style.display = 'block';
    });
    
    // Explore jobs button
    exploreJobsBtn.addEventListener('click', function() {
        document.getElementById('jobs').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Close modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        resetUploadResult();
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            resetUploadResult();
        }
    });
    
    // Browse files button
    browseBtn.addEventListener('click', function() {
        resumeInput.click();
    });
    
    // File input change
    resumeInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            handleResumeUpload(this.files[0]);
        }
    });
    
    // Drag and drop functionality
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.borderColor = '#4361ee';
        this.style.backgroundColor = 'rgba(67, 97, 238, 0.05)';
    });
    
    uploadArea.addEventListener('dragleave', function() {
        this.style.borderColor = '#e9ecef';
        this.style.backgroundColor = 'transparent';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.borderColor = '#e9ecef';
        this.style.backgroundColor = 'transparent';
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleResumeUpload(e.dataTransfer.files[0]);
        }
    });
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // In a real application, you would send this data to a server
        console.log('Contact form submitted:', { name, email, message });
        
        // Show success message
        alert('Thank you for your message! We will get back to you soon.');
        
        // Reset form
        contactForm.reset();
    });
}

// Handle resume upload
function handleResumeUpload(file) {
    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!validTypes.includes(file.type)) {
        alert('Please upload a PDF or Word document.');
        return;
    }
    
    // Show loading state
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.innerHTML = '<i class="fas fa-spinner fa-spin"></i><p>Analyzing your resume...</p>';
    
    // Simulate processing delay
    setTimeout(() => {
        // In a real application, you would send the file to a server for processing
        // For this demo, we'll simulate the response
        
        // Sample extracted skills (in a real app, this would come from the backend)
        const extractedSkills = ['JavaScript', 'React', 'HTML', 'CSS', 'Node.js', 'Git'];
        
        // Sample job recommendations
        const jobRecommendations = [
            {
                title: 'Frontend Developer',
                company: 'TechCorp Inc.',
                match: '95%'
            },
            {
                title: 'Full Stack Developer',
                company: 'WebSolutions',
                match: '88%'
            },
            {
                title: 'UI Developer',
                company: 'DesignTech',
                match: '82%'
            },
            {
                title: 'JavaScript Developer',
                company: 'CodeMasters',
                match: '90%'
            },
            {
                title: 'React Developer',
                company: 'ReactExperts',
                match: '94%'
            }
        ];
        
        // Sample course recommendations
        const courseRecommendations = [
            {
                title: 'Advanced React Patterns',
                provider: 'Udemy',
                duration: '12 hours'
            },
            {
                title: 'Node.js Microservices',
                provider: 'Coursera',
                duration: '4 weeks'
            },
            {
                title: 'AWS Certified Developer',
                provider: 'AWS Training',
                duration: '6 weeks'
            },
            {
                title: 'Modern JavaScript ES6+',
                provider: 'Pluralsight',
                duration: '8 hours'
            },
            {
                title: 'Full Stack Development',
                provider: 'edX',
                duration: '12 weeks'
            }
        ];
        
        // Display results
        displayUploadResult(extractedSkills, jobRecommendations, courseRecommendations);
    }, 2000);
}

// Display upload results
function displayUploadResult(skills, jobs, courses) {
    const uploadResult = document.getElementById('uploadResult');
    const skillList = document.getElementById('skillList');
    const jobRecommendations = document.getElementById('jobRecommendations');
    const courseRecommendations = document.getElementById('courseRecommendations');
    
    // Populate skills
    skillList.innerHTML = '';
    skills.forEach(skill => {
        const skillElement = document.createElement('span');
        skillElement.className = 'skill-tag';
        skillElement.textContent = skill;
        skillList.appendChild(skillElement);
    });
    
    // Populate job recommendations
    jobRecommendations.innerHTML = '';
    jobs.forEach(job => {
        const jobElement = document.createElement('div');
        jobElement.className = 'recommendation-item';
        jobElement.innerHTML = `
            <h4>${job.title}</h4>
            <p>${job.company} • Match: ${job.match}</p>
            <button class="btn-primary apply-recommendation-btn" style="margin-top: 10px; padding: 5px 10px; font-size: 0.8rem;">Apply</button>
        `;
        jobRecommendations.appendChild(jobElement);
    });
    
    // Add event listeners to apply buttons in recommendations
    document.querySelectorAll('.apply-recommendation-btn').forEach(button => {
        button.addEventListener('click', function() {
            const jobTitle = this.parentElement.querySelector('h4').textContent;
            alert(`Applying for: ${jobTitle}`);
        });
    });
    
    // Populate course recommendations
    courseRecommendations.innerHTML = '';
    courses.forEach(course => {
        const courseElement = document.createElement('div');
        courseElement.className = 'recommendation-item';
        courseElement.innerHTML = `
            <h4>${course.title}</h4>
            <p>${course.provider} • ${course.duration}</p>
            <button class="btn-secondary view-course-btn" style="margin-top: 10px; padding: 5px 10px; font-size: 0.8rem;">View Course</button>
        `;
        courseRecommendations.appendChild(courseElement);
    });
    
    // Add event listeners to view course buttons
    document.querySelectorAll('.view-course-btn').forEach(button => {
        button.addEventListener('click', function() {
            const courseTitle = this.parentElement.querySelector('h4').textContent;
            alert(`Viewing course: ${courseTitle}`);
        });
    });
    
    // Show results
    uploadResult.style.display = 'block';
    
    // Scroll to results
    uploadResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Reset upload result
function resetUploadResult() {
    const uploadResult = document.getElementById('uploadResult');
    const uploadArea = document.getElementById('uploadArea');
    
    uploadResult.style.display = 'none';
    uploadArea.innerHTML = `
        <i class="fas fa-cloud-upload-alt"></i>
        <p>Drag & Drop your resume here</p>
        <p>or</p>
        <button class="btn-primary" id="browseBtn">Browse Files</button>
    `;
    
    // Reattach event listeners to the new button
    const newButton = document.getElementById('browseBtn');
    const resumeInput = document.getElementById('resumeInput');
    
    newButton.addEventListener('click', function() {
        resumeInput.click();
    });
}

// Initialize animations
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.about-card, .job-card, .skill-category, .team-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .about-card, .job-card, .skill-category, .team-card {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .about-card.animate-in, .job-card.animate-in, .skill-category.animate-in, .team-card.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .about-card:nth-child(2) { transition-delay: 0.1s; }
        .about-card:nth-child(3) { transition-delay: 0.2s; }
        .about-card:nth-child(4) { transition-delay: 0.3s; }
        
        .job-card:nth-child(2) { transition-delay: 0.1s; }
        .job-card:nth-child(3) { transition-delay: 0.2s; }
        .job-card:nth-child(4) { transition-delay: 0.3s; }
        .job-card:nth-child(5) { transition-delay: 0.4s; }
        .job-card:nth-child(6) { transition-delay: 0.5s; }
        .job-card:nth-child(7) { transition-delay: 0.6s; }
        .job-card:nth-child(8) { transition-delay: 0.7s; }
        
        .team-card:nth-child(2) { transition-delay: 0.1s; }
        .team-card:nth-child(3) { transition-delay: 0.2s; }
        .team-card:nth-child(4) { transition-delay: 0.3s; }
        
        .no-jobs {
            text-align: center;
            grid-column: 1 / -1;
            padding: 40px;
            font-size: 1.2rem;
            color: var(--gray-color);
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
            color: var(--dark-color);
        }
    `;
    document.head.appendChild(style);
}
