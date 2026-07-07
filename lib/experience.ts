/**
 * Employment history — single source of truth for resume.
 *
 * Sources from components/Experience.tsx deployments array.
 * Edit Experience.tsx to update; this file is consumed by /resume.
 */
export type Experience = {
  hash: string;
  company: string;
  role: string;
  period: string;
  location: string;
  current: boolean;
  highlights: string[];
  tags: string[];
};

export const experience: Experience[] = [
  {
    hash: "f1a9e03",
    company: "CP Axtra",
    role: "Senior Software Engineer",
    period: "Jun 2026 — Present",
    location: "Remote",
    current: true,
    highlights: [
      "Developing backend microservices for a payment-related invoice processing system using Java 21, Spring Boot 3.5, Spring WebFlux, and PostgreSQL.",
      "Built event-driven Kafka consumers handling multiple event types with header-based routing, DLQ fan-out, and structured error recovery.",
      "Implemented distributed ShedLock batch schedulers for timed invoice submission workflows, with partial-failure handling and audit logging.",
      "Designed dual-chain Spring Security: static Bearer-token auth for internal service-to-service calls and Keycloak OAuth2 JWT for external consumers.",
      "Built a Testcontainers-based integration testing framework with a reusable base class (real PostgreSQL, WebTestClient, FK-safe teardown) — raising the JaCoCo instruction coverage gate to 75%.",
      "Modernised Gradle build: Boot BOM as platform(), separate unit/integration test tasks, Allure 2.39 + JaCoCo Cobertura wired into GitLab CI.",
      "Integrated Tencent Cloud COS for cloud object storage and built external API clients for downstream services using Spring WebClient.",
      "Collaborating with product, QA, and cross-functional teams to deliver payment-related backend features.",
    ],
    tags: ["Java 21", "Spring Boot 3.5", "WebFlux", "Kafka", "PostgreSQL", "Testcontainers", "ShedLock", "Keycloak", "Tencent Cloud", "GitLab CI", "Docker"],
  },
  {
    hash: "a8f3c12",
    company: "AppDirect",
    role: "Software Development Engineer II",
    period: "Sep 2022 — Jun 2026",
    location: "Pune, IN",
    current: false,
    highlights: [
      "Designed and own multiple high-availability microservices for Billing, Checkout, Notifications, and Payments — supporting thousands of concurrent requests with p99 < 200ms and 99.9%+ availability.",
      "Built integrations with PayPal, Stripe, and Billpay via custom connectors ensuring secure, reliable payment processing.",
      "Migrated legacy RabbitMQ event pipelines to Kafka — improving event throughput by ~4×, enabling horizontal scalability and replayable, fault-tolerant processing for workflows handling millions of events/day.",
      "Decomposed a monolithic system into domain-aligned microservices using event-driven architecture, enabling independent scaling, faster deployments, and improved fault isolation.",
      "Developed MicroUI components using React and Mantine for real-time user features and operational visibility.",
      "Practiced TDD with JUnit and Mockito; delivered CI/CD pipelines using GitHub Actions.",
      "On-call rotations: debugging production incidents, performing RCA, and implementing long-term reliability fixes.",
    ],
    tags: ["Java", "Spring Boot", "Kafka", "Microservices", "React", "Docker", "K8s", "Prometheus"],
  },
  {
    hash: "1d92b07",
    company: "Infosys",
    role: "Senior Systems Engineer",
    period: "Nov 2020 — Sep 2022",
    location: "Pune, IN",
    current: false,
    highlights: [
      "Customized and extended core banking modules using Java and JavaScript to meet client-specific regulatory requirements in mission-critical banking systems.",
      "Migrated legacy Finacle scripts to modern Java-based microservices, improving maintainability, testability, and deployment reliability.",
      "Built and maintained EOD/BOD automation workflows, reducing manual effort and operational risk.",
      "Delivered scalable solutions across CASA, Loans, and Term Deposit modules, ensuring transactional integrity and data consistency.",
      "Investigated and resolved production issues, performed RCA, and implemented stabilising fixes.",
    ],
    tags: ["Java", "JavaScript", "Finacle", "Banking", "Microservices", "MySQL"],
  },
];
