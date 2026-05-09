import { siteConfig } from "@/lib/site";

/**
 * Server-rendered JSON-LD structured data — Person, WebSite, ProfessionalService.
 * Helps Google surface the portfolio for branded queries and recruiter searches.
 * https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
 */
export default function JsonLd() {
  const base = siteConfig.url.replace(/\/$/, "");

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: base,
    image: `${base}/lekhraj.png`,
    email: `mailto:${siteConfig.email}`,
    jobTitle: siteConfig.jobTitle,
    description: siteConfig.bio,
    worksFor: {
      "@type": "Organization",
      name: "AppDirect",
      url: "https://www.appdirect.com",
    },
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "National Institute of Technology, Hamirpur",
        url: "https://nith.ac.in",
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.location.city,
      addressRegion: siteConfig.location.region,
      addressCountry: siteConfig.location.countryCode,
    },
    sameAs: [
      siteConfig.social.github,
      siteConfig.social.linkedin,
      siteConfig.social.leetcode,
    ],
    knowsAbout: [
      "Java",
      "Spring Boot",
      "Apache Kafka",
      "Distributed Systems",
      "Microservices Architecture",
      "System Design",
      "PostgreSQL",
      "React",
      "TypeScript",
      "AWS",
      "Docker",
      "Kubernetes",
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: base,
    name: `${siteConfig.name} — Portfolio`,
    description: siteConfig.bio,
    inLanguage: "en",
    author: { "@type": "Person", name: siteConfig.name, url: base },
  };

  const professionalService = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `${siteConfig.name} — Software Engineering`,
    description:
      "Senior software engineering for high-throughput distributed systems, microservices, and full-stack web applications.",
    url: base,
    areaServed: ["Worldwide", "Remote"],
    serviceType: [
      "Backend Engineering",
      "Distributed Systems Consulting",
      "System Design",
      "Full Stack Development",
    ],
    provider: { "@type": "Person", name: siteConfig.name },
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [person, website, professionalService],
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
