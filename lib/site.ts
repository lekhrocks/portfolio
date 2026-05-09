/**
 * Single source of truth for site metadata used across SEO, sitemap, OG, JSON-LD.
 * Override SITE_URL via NEXT_PUBLIC_SITE_URL in production (e.g. Vercel env).
 */
export const siteConfig = {
  name: "Lekhraj Kumar",
  shortName: "Lekhraj",
  jobTitle: "Software Engineer",
  tagline: "Backend Software Engineer who also works in UI using React",
  bio: "Software Engineer with 5+ years building high-throughput distributed systems in payments and SaaS. Java, Spring Boot, Kafka, microservices and React.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://lekhrajkumar.vercel.app",
  email: "lekh.nith@gmail.com",
  location: {
    city: "Pune",
    region: "Maharashtra",
    country: "India",
    countryCode: "IN",
  },
  social: {
    github: "https://github.com/lekhrocks",
    githubUser: "lekhrocks",
    linkedin: "https://linkedin.com/in/lekhrajkumar",
    leetcode: "https://leetcode.com/u/lekh_nith/",
    leetcodeUser: "lekh_nith",
  },
  keywords: [
    "Lekhraj Kumar",
    "Software Engineer",
    "Backend Engineer",
    "Full Stack Engineer",
    "Java Developer",
    "Spring Boot",
    "Distributed Systems",
    "Microservices",
    "Apache Kafka",
    "System Design",
    "React Developer",
    "AppDirect",
    "Pune",
  ],
} as const;
