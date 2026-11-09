// Resume analysis: find skills in resume text, score jobs against them and
// suggest courses that cover the skills the candidate is missing.

const { jobs, courses, extraSkills, skillAliases } = require('./data');

const normalize = (s) => s.trim().toLowerCase();

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Matches a term only when it is not part of a bigger word, so "Java" does
// not match "JavaScript" and "SEO" does not match "seoul". Lookarounds are
// used instead of \b so terms like "C++", "C#" and "Node.js" work.
function termPattern(term) {
  const body = escapeRegex(normalize(term)).replace(/\s+/g, '\\s+');
  return new RegExp(`(?<![a-z0-9+#])${body}(?![a-z0-9+#])`, 'i');
}

// Every skill the app knows about: everything in jobs and courses plus the
// extra list. Keyed by lowercase name so each skill appears once.
function buildVocabulary() {
  const vocab = new Map();
  const add = (name) => {
    const key = normalize(name);
    if (!vocab.has(key)) vocab.set(key, { name, patterns: [termPattern(name)] });
  };

  jobs.forEach((job) => job.skills.forEach(add));
  courses.forEach((course) => course.skills.forEach(add));
  extraSkills.forEach(add);

  Object.entries(skillAliases).forEach(([name, aliases]) => {
    add(name);
    const entry = vocab.get(normalize(name));
    aliases.forEach((alias) => entry.patterns.push(termPattern(alias)));
  });

  return vocab;
}

const vocabulary = buildVocabulary();

/** Returns the display names of all known skills found in the text. */
function extractSkills(text) {
  const found = [];
  for (const { name, patterns } of vocabulary.values()) {
    if (patterns.some((p) => p.test(text))) found.push(name);
  }
  return found;
}

/** Scores every job against the skills and returns the best `limit` matches. */
function matchJobs(skills, limit = 5) {
  const have = new Set(skills.map(normalize));

  return jobs
    .map((job) => {
      const matchingSkills = job.skills.filter((s) => have.has(normalize(s)));
      const missingSkills = job.skills.filter((s) => !have.has(normalize(s)));
      return {
        ...job,
        match: Math.round((matchingSkills.length / job.skills.length) * 100),
        matchingSkills,
        missingSkills
      };
    })
    .filter((job) => job.match > 0)
    .sort((a, b) => b.match - a.match)
    .slice(0, limit);
}

/**
 * Recommends courses that teach skills missing from the top job matches.
 * Courses covering more of those skills rank higher; rating breaks ties.
 * If no job matched at all, falls back to any course teaching something new.
 */
function recommendCourses(skills, jobMatches, limit = 5) {
  const have = new Set(skills.map(normalize));
  const needed = new Set();
  jobMatches.forEach((job) => job.missingSkills.forEach((s) => needed.add(normalize(s))));

  const isUseful = needed.size > 0
    ? (s) => needed.has(normalize(s))
    : (s) => !have.has(normalize(s));

  return courses
    .map((course) => ({ ...course, teachesSkills: course.skills.filter(isUseful) }))
    .filter((course) => course.teachesSkills.length > 0)
    .sort((a, b) => b.teachesSkills.length - a.teachesSkills.length || b.rating - a.rating)
    .slice(0, limit);
}

module.exports = { extractSkills, matchJobs, recommendCourses };
