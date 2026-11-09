// Static data for the app: job listings, courses and the skill vocabulary
// used when scanning resumes. This is the single source of truth — the
// frontend loads jobs from the API instead of keeping its own copy.

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

// Extra skills to look for in resumes, on top of every skill that appears in
// a job or course above. Written with their display capitalisation.
const extraSkills = [
  // technical
  "Java", "C++", "C#", "PHP", "Ruby", "Golang", "Rust", "Angular", "Vue",
  "Express", "Django", "Flask", "Sass", "Bootstrap", "Tailwind", "MySQL",
  "PostgreSQL", "Firebase", "Azure", "Google Cloud", "Git", "GitHub", "GitLab",
  "REST API", "GraphQL", "CI/CD",
  // design
  "Adobe XD", "Sketch", "InVision", "Illustrator", "UX Design",
  "Responsive Design", "Web Design",
  // business
  "Project Management", "Scrum", "Kanban", "Trello", "Product Management",
  "Business Analysis", "Strategic Planning", "Power BI", "Financial Modeling",
  "Leadership", "Stakeholder Management",
  // marketing
  "SEM", "Google Ads", "Facebook Ads", "Brand Management", "Digital Strategy",
  // soft skills
  "Communication", "Teamwork", "Problem Solving", "Critical Thinking",
  "Time Management"
];

// Other ways people write the same skill. Keys must match a skill name above
// (case-insensitive); values are the alternative spellings.
const skillAliases = {
  "Node.js": ["nodejs", "node js"],
  "JavaScript": ["js", "es6"],
  "React": ["react.js", "reactjs"],
  "Vue": ["vue.js", "vuejs"],
  "Golang": ["go lang"],
  "PostgreSQL": ["postgres"],
  "MongoDB": ["mongo"],
  "AWS": ["amazon web services"],
  "Kubernetes": ["k8s"],
  "Machine Learning": ["ml"],
  "UI Design": ["ui/ux", "user interface design"],
  "UX Research": ["user experience research", "usability testing"],
  "Adobe Creative Suite": ["adobe creative cloud"],
  "SEO": ["search engine optimization"],
  "Data Visualization": ["data visualisation"],
  "CI/CD": ["continuous integration"],
  "REST API": ["rest apis", "restful", "restful api", "restful apis"]
};

module.exports = { jobs, courses, extraSkills, skillAliases };
