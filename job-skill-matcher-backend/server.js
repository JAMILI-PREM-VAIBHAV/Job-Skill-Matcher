const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const natural = require('natural');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'));
    }
  }
});

// Ensure uploads directory exists
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

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
    posted: "2 days ago",
    experience: "2+ years",
    education: "Bachelor's in Computer Science"
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
    posted: "1 week ago",
    experience: "3+ years",
    education: "Bachelor's in Design or related field"
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
    posted: "3 days ago",
    experience: "2+ years",
    education: "Bachelor's in Statistics, Mathematics, or related field"
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
    posted: "5 days ago",
    experience: "2+ years",
    education: "Bachelor's in Marketing or related field"
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
    posted: "1 day ago",
    experience: "3+ years",
    education: "Bachelor's in Computer Science"
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
    posted: "4 days ago",
    experience: "4+ years",
    education: "Bachelor's in Business, Computer Science, or related field"
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
    posted: "2 weeks ago",
    experience: "2+ years",
    education: "Bachelor's in Graphic Design or related field"
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
    posted: "6 days ago",
    experience: "2+ years",
    education: "Bachelor's in Marketing, Communications, or related field"
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
    posted: "3 days ago",
    experience: "3+ years",
    education: "Bachelor's in Computer Science or related field"
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
    posted: "1 week ago",
    experience: "3+ years",
    education: "Bachelor's in Communications, Journalism, or related field"
  }
];

// Sample courses data
const courses = [
  {
    id: 1,
    title: "Advanced React Patterns",
    provider: "Udemy",
    duration: "12 hours",
    level: "Intermediate",
    skills: ["React", "JavaScript", "Redux"],
    rating: 4.7,
    price: "$94.99",
    url: "https://www.udemy.com/course/advanced-react-patterns/"
  },
  {
    id: 2,
    title: "Node.js Microservices",
    provider: "Coursera",
    duration: "4 weeks",
    level: "Advanced",
    skills: ["Node.js", "Microservices", "Docker"],
    rating: 4.5,
    price: "Free",
    url: "https://www.coursera.org/learn/nodejs-microservices"
  },
  {
    id: 3,
    title: "AWS Certified Developer",
    provider: "AWS Training",
    duration: "6 weeks",
    level: "Intermediate",
    skills: ["AWS", "Cloud Computing", "DevOps"],
    rating: 4.8,
    price: "$299",
    url: "https://aws.amazon.com/training/"
  },
  {
    id: 4,
    title: "Modern JavaScript ES6+",
    provider: "Pluralsight",
    duration: "8 hours",
    level: "Beginner",
    skills: ["JavaScript", "ES6", "Web Development"],
    rating: 4.6,
    price: "$29/month",
    url: "https://www.pluralsight.com/courses/modern-javascript-es6"
  },
  {
    id: 5,
    title: "Full Stack Development",
    provider: "edX",
    duration: "12 weeks",
    level: "Beginner",
    skills: ["HTML", "CSS", "JavaScript", "Node.js", "MongoDB"],
    rating: 4.4,
    price: "Free",
    url: "https://www.edx.org/learn/full-stack-development"
  },
  {
    id: 6,
    title: "UI/UX Design Fundamentals",
    provider: "LinkedIn Learning",
    duration: "6 hours",
    level: "Beginner",
    skills: ["UI Design", "UX Research", "Figma"],
    rating: 4.5,
    price: "$29.99/month",
    url: "https://www.linkedin.com/learning/ui-ux-design-fundamentals"
  },
  {
    id: 7,
    title: "Data Science with Python",
    provider: "DataCamp",
    duration: "8 weeks",
    level: "Intermediate",
    skills: ["Python", "Data Analysis", "Machine Learning"],
    rating: 4.7,
    price: "$25/month",
    url: "https://www.datacamp.com/tracks/data-scientist-with-python"
  },
  {
    id: 8,
    title: "Digital Marketing Certification",
    provider: "Google Digital Garage",
    duration: "40 hours",
    level: "Beginner",
    skills: ["SEO", "Content Marketing", "Social Media", "Analytics"],
    rating: 4.6,
    price: "Free",
    url: "https://learndigital.withgoogle.com/digitalgarage"
  }
];

// Skill keywords for extraction
const skillKeywords = {
  technical: [
    'javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust',
    'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask',
    'html', 'css', 'sass', 'less', 'bootstrap', 'tailwind',
    'mongodb', 'mysql', 'postgresql', 'sql', 'redis', 'firebase',
    'aws', 'azure', 'google cloud', 'docker', 'kubernetes', 'jenkins',
    'git', 'github', 'gitlab', 'rest api', 'graphql', 'microservices'
  ],
  design: [
    'figma', 'adobe xd', 'sketch', 'invision', 'photoshop', 'illustrator',
    'ui design', 'ux design', 'user research', 'wireframing', 'prototyping',
    'responsive design', 'mobile design', 'web design', 'typography'
  ],
  business: [
    'project management', 'agile', 'scrum', 'kanban', 'jira', 'trello',
    'product management', 'business analysis', 'strategic planning',
    'data analysis', 'excel', 'tableau', 'power bi', 'financial modeling',
    'leadership', 'team management', 'stakeholder management'
  ],
  marketing: [
    'seo', 'sem', 'content marketing', 'social media', 'email marketing',
    'google analytics', 'google ads', 'facebook ads', 'conversion optimization',
    'brand management', 'digital strategy', 'content strategy'
  ],
  soft: [
    'communication', 'teamwork', 'problem solving', 'critical thinking',
    'time management', 'adaptability', 'creativity', 'leadership'
  ]
};

// Extract text from PDF
async function extractTextFromPDF(buffer) {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    throw new Error('Error parsing PDF: ' + error.message);
  }
}

// Extract text from Word document
async function extractTextFromWord(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer: buffer });
    return result.value;
  } catch (error) {
    throw new Error('Error parsing Word document: ' + error.message);
  }
}

// Extract skills from text
function extractSkills(text) {
  const extractedSkills = new Set();
  const textLower = text.toLowerCase();
  
  // Check for skills in each category
  Object.values(skillKeywords).forEach(category => {
    category.forEach(skill => {
      if (textLower.includes(skill.toLowerCase())) {
        extractedSkills.add(skill);
      }
    });
  });
  
  return Array.from(extractedSkills);
}

// Match jobs based on skills
function matchJobs(skills) {
  const jobMatches = jobs.map(job => {
    const jobSkills = job.skills.map(skill => skill.toLowerCase());
    const userSkills = skills.map(skill => skill.toLowerCase());
    
    const matchingSkills = jobSkills.filter(jobSkill => 
      userSkills.some(userSkill => userSkill.includes(jobSkill) || jobSkill.includes(userSkill))
    );
    
    const matchPercentage = Math.round((matchingSkills.length / jobSkills.length) * 100);
    
    return {
      ...job,
      match: matchPercentage,
      matchingSkills: matchingSkills
    };
  });
  
  // Sort by match percentage (descending)
  return jobMatches.sort((a, b) => b.match - a.match).slice(0, 5);
}

// Recommend courses based on skills and job matches
function recommendCourses(skills, jobMatches) {
  const neededSkills = new Set();
  
  // Get skills from top job matches that user doesn't have
  jobMatches.forEach(job => {
    job.skills.forEach(skill => {
      if (!skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())) {
        neededSkills.add(skill);
      }
    });
  });
  
  // Match courses to needed skills
  const courseMatches = courses.filter(course => {
    return course.skills.some(skill => 
      Array.from(neededSkills).some(neededSkill => 
        skill.toLowerCase().includes(neededSkill.toLowerCase()) || 
        neededSkill.toLowerCase().includes(skill.toLowerCase())
      )
    );
  });
  
  return courseMatches.slice(0, 5);
}

// Routes

// Get all jobs
app.get('/api/jobs', (req, res) => {
  const { category } = req.query;
  
  let filteredJobs = jobs;
  if (category && category !== 'all') {
    filteredJobs = jobs.filter(job => job.category === category);
  }
  
  res.json({
    success: true,
    data: filteredJobs,
    count: filteredJobs.length
  });
});

// Get job by ID
app.get('/api/jobs/:id', (req, res) => {
  const jobId = parseInt(req.params.id);
  const job = jobs.find(j => j.id === jobId);
  
  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }
  
  res.json({
    success: true,
    data: job
  });
});

// Upload and analyze resume
app.post('/api/analyze-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    let text = '';
    const fileBuffer = fs.readFileSync(req.file.path);

    // Extract text based on file type
    if (req.file.mimetype === 'application/pdf') {
      text = await extractTextFromPDF(fileBuffer);
    } else if (req.file.mimetype.includes('word')) {
      text = await extractTextFromWord(fileBuffer);
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    // Extract skills
    const skills = extractSkills(text);
    
    // Match jobs
    const jobMatches = matchJobs(skills);
    
    // Recommend courses
    const courseRecommendations = recommendCourses(skills, jobMatches);

    res.json({
      success: true,
      data: {
        extractedText: text.substring(0, 500) + '...', // First 500 chars for preview
        skills: skills,
        jobRecommendations: jobMatches,
        courseRecommendations: courseRecommendations
      }
    });

  } catch (error) {
    console.error('Error processing resume:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing resume: ' + error.message
    });
  }
});

// Submit job application
app.post('/api/apply', (req, res) => {
  const { jobId, name, email, coverLetter } = req.body;
  
  // Validate required fields
  if (!jobId || !name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: jobId, name, and email are required'
    });
  }
  
  // In a real application, you would:
  // 1. Validate the job exists
  // 2. Store the application in a database
  // 3. Send confirmation emails
  // 4. Process any file uploads
  
  const job = jobs.find(j => j.id === parseInt(jobId));
  if (!job) {
    return res.status(404).json({
      success: false,
      message: 'Job not found'
    });
  }
  
  // Simulate processing delay
  setTimeout(() => {
    res.json({
      success: true,
      message: `Application submitted successfully for ${job.title} at ${job.company}`,
      data: {
        applicationId: 'APP_' + Date.now(),
        job: job.title,
        company: job.company,
        applicant: name,
        timestamp: new Date().toISOString()
      }
    });
  }, 1000);
});

// Get all courses
app.get('/api/courses', (req, res) => {
  res.json({
    success: true,
    data: courses,
    count: courses.length
  });
});

// Contact form submission
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required'
    });
  }
  
  // In a real application, you would:
  // 1. Store the message in a database
  // 2. Send email notifications
  // 3. Integrate with a CRM
  
  res.json({
    success: true,
    message: 'Thank you for your message! We will get back to you soon.',
    data: {
      contactId: 'CONTACT_' + Date.now(),
      name: name,
      email: email,
      timestamp: new Date().toISOString()
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve frontend (if you're serving static files)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
  }
  
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`!!! Server is running on port ${PORT}`);
  console.log(`!!! API endpoints available at http://localhost:${PORT}/api`);
  console.log(`!!! Frontend available at http://localhost:${PORT}`);
});
