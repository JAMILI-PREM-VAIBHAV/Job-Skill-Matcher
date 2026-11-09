const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
require('dotenv').config();

const { jobs, courses } = require('./data');
const { extractSkills, matchJobs, recommendCourses } = require('./matcher');

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_DIR = path.join(__dirname, '..', 'job_skill_matcher-frontend');

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

// The frontend loads fonts and icons from CDNs, so those hosts are allowed
// in the Content Security Policy.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdnjs.cloudflare.com'],
        'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com', 'https://cdnjs.cloudflare.com'],
        'img-src': ["'self'", 'data:'],
        // The app runs on plain http://localhost, so don't force https.
        'upgrade-insecure-requests': null
      }
    }
  })
);
app.use(cors());
app.use(express.json({ limit: '100kb' }));
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' }
  })
);

// Resumes are kept in memory only — they are parsed and then discarded,
// never written to disk.
const PDF_TYPE = 'application/pdf';
const DOCX_TYPE = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

function resumeKind(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (file.mimetype === PDF_TYPE || ext === '.pdf') return 'pdf';
  if (file.mimetype === DOCX_TYPE || ext === '.docx') return 'docx';
  return null;
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter(req, file, cb) {
    if (resumeKind(file)) return cb(null, true);
    const err = new Error('Invalid file type. Please upload a PDF or Word (.docx) document.');
    err.status = 400;
    cb(err);
  }
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function extractText(file) {
  if (resumeKind(file) === 'pdf') {
    const data = await pdf(file.buffer);
    return data.text;
  }
  const result = await mammoth.extractRawText({ buffer: file.buffer });
  return result.value;
}

function badRequest(res, message) {
  return res.status(400).json({ success: false, message });
}

// ---------------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/api/jobs', (req, res) => {
  const { category } = req.query;
  const data = category && category !== 'all' ? jobs.filter((j) => j.category === category) : jobs;
  res.json({ success: true, data, count: data.length });
});

app.get('/api/jobs/:id', (req, res) => {
  const job = jobs.find((j) => j.id === Number(req.params.id));
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
  res.json({ success: true, data: job });
});

app.get('/api/courses', (req, res) => {
  res.json({ success: true, data: courses, count: courses.length });
});

app.post('/api/analyze-resume', upload.single('resume'), async (req, res, next) => {
  if (!req.file) return badRequest(res, 'No file uploaded.');

  let text;
  try {
    text = await extractText(req.file);
  } catch (err) {
    console.error('Resume parsing failed:', err.message);
    return res.status(422).json({
      success: false,
      message: 'We could not read that file. Make sure it is a valid, non-password-protected PDF or .docx.'
    });
  }

  if (!text || !text.trim()) {
    return res.status(422).json({
      success: false,
      message: 'No text found in the resume. Scanned/image-only PDFs are not supported.'
    });
  }

  try {
    const skills = extractSkills(text);
    const jobRecommendations = matchJobs(skills);
    const courseRecommendations = recommendCourses(skills, jobRecommendations);

    res.json({
      success: true,
      data: { skills, jobRecommendations, courseRecommendations }
    });
  } catch (err) {
    next(err);
  }
});

app.post('/api/apply', upload.single('resume'), (req, res) => {
  const { jobId, name, email, coverLetter } = req.body;

  if (!jobId || !name?.trim() || !email?.trim()) {
    return badRequest(res, 'Name, email and job are required.');
  }
  if (!EMAIL_RE.test(email)) return badRequest(res, 'Please enter a valid email address.');

  const job = jobs.find((j) => j.id === Number(jobId));
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

  // Demo app: there is no database, so the application is acknowledged but
  // not stored. This is where you'd save it and send a confirmation email.
  res.json({
    success: true,
    message: `Application submitted for ${job.title} at ${job.company}`,
    data: {
      applicationId: 'APP_' + Date.now(),
      job: job.title,
      company: job.company,
      applicant: name.trim(),
      hasResume: Boolean(req.file),
      hasCoverLetter: Boolean(coverLetter?.trim()),
      timestamp: new Date().toISOString()
    }
  });
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return badRequest(res, 'All fields are required.');
  }
  if (!EMAIL_RE.test(email)) return badRequest(res, 'Please enter a valid email address.');

  res.json({
    success: true,
    message: 'Thank you for your message! We will get back to you soon.',
    data: { contactId: 'CONTACT_' + Date.now(), timestamp: new Date().toISOString() }
  });
});

app.post('/api/subscribe', (req, res) => {
  const { email } = req.body;
  if (!email || !EMAIL_RE.test(email)) return badRequest(res, 'Please enter a valid email address.');
  res.json({ success: true, message: 'Subscribed! You will hear about new jobs first.' });
});

// Unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// ---------------------------------------------------------------------------
// Frontend
// ---------------------------------------------------------------------------

app.use(express.static(FRONTEND_DIR));

// ---------------------------------------------------------------------------
// Error handling
// ---------------------------------------------------------------------------

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'File too large. Maximum size is 5MB.' : err.message;
    return badRequest(res, message);
  }
  if (err.type === 'entity.parse.failed') return badRequest(res, 'Invalid JSON body.');
  if (err.status && err.status < 500) return res.status(err.status).json({ success: false, message: err.message });

  console.error('Server error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`API available at  http://localhost:${PORT}/api`);
});
