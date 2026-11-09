# JobSkill Matcher

A full-stack web app that reads your resume, finds the skills in it, matches
you with suitable jobs and recommends courses to fill the skill gaps.

## Features

- **Resume analysis**: upload a PDF or Word (.docx) resume. The server
  extracts the text and finds known skills such as JavaScript, Node.js, C++
  and Figma.
- **Job matching**: each job gets a match percentage, with the skills you
  have and the skills you're missing.
- **Course recommendations**: courses ranked by how many of your missing
  skills they teach.
- **Job listings** with category filters, saved jobs (stored in your
  browser) and an application form.
- Contact and newsletter forms backed by API endpoints.

## Tech stack

| Part     | Technology                                                    |
|----------|---------------------------------------------------------------|
| Frontend | HTML, CSS, vanilla JavaScript                                 |
| Backend  | Node.js, Express                                              |
| Parsing  | `pdf-parse` (PDF), `mammoth` (Word .docx)                     |
| Security | `helmet` (security headers / CSP), `express-rate-limit`, CORS |

## Project structure

```
Job-Skill-Matcher/
├── job_skill_matcher-frontend/
│   ├── index.html        # Page markup
│   ├── styles.css        # Styles
│   └── script.js         # UI logic + API calls
└── job-skill-matcher-backend/
    ├── server.js         # Express app, API routes, serves the frontend
    ├── matcher.js        # Skill extraction, job matching, course ranking
    ├── data.js           # Jobs, courses and skill vocabulary
    ├── .env.example      # Copy to .env to configure
    └── package.json
```

## Getting started

Requirements: [Node.js](https://nodejs.org/) 16 or newer.

```bash
cd job-skill-matcher-backend
npm install
npm start
```

Then open **http://localhost:3000** in your browser.

To have the server restart automatically when you change code, run
`npm run dev` instead of `npm start`.

To change the port, copy `.env.example` to `.env` and edit `PORT`.

## API

| Method | Endpoint               | Description                                                   |
|--------|------------------------|---------------------------------------------------------------|
| GET    | `/api/health`          | Server status                                                 |
| GET    | `/api/jobs?category=`  | List jobs (`tech`, `design`, `business`, `marketing`, `all`)  |
| GET    | `/api/jobs/:id`        | Get one job                                                   |
| GET    | `/api/courses`         | List courses                                                  |
| POST   | `/api/analyze-resume`  | `multipart/form-data` with a `resume` file (PDF/.docx, ≤5MB)  |
| POST   | `/api/apply`           | `multipart/form-data`: `jobId`, `name`, `email`, `coverLetter`, `resume` |
| POST   | `/api/contact`         | JSON: `name`, `email`, `message`                              |
| POST   | `/api/subscribe`       | JSON: `email`                                                 |

Every response has the shape `{ "success": boolean, "message"?: string, "data"?: ... }`.

## Limitations

- Jobs and courses are sample data in `data.js`. There is no database, so
  applications, contact messages and subscriptions are acknowledged but not
  stored.
- Skill detection uses a fixed skill list. Skills not in that list
  (`data.js`) won't be recognised.
- Scanned (image-only) PDFs and old `.doc` files can't be read.

## Team

Prem Vaibhav Jamili · Akash Inapanuri · Anand Dasari
