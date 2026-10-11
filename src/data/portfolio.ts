export const profile = {
  name: "Rohit",
  fullName: "Rohit Sonawane",
  role: "Senior Backend Engineer",
  headline: "Hi, I'm Rohit. I design and ship reliable software.",
  description:
    "Backend-focused software engineer building production APIs, multi-tenant products, and cloud-deployed applications with NestJS, TypeScript, PostgreSQL, AWS, and Next.js.",
  heroDescription:
    "Building reliable backends. Crafting thoughtful products. Turning complex problems into software that works.",
  // configuredLink() only promotes https:, mailto: or root-relative values to a
  // real href, so the scheme belongs in the data.
  email: "mailto:rohit@imrohit.dev",
  github: "https://github.com/rohitsonawane11",
  linkedin: "https://www.linkedin.com/in/rohit-sonawane-b4679b43",
  resume: "/rohit-sonawane-resume.pdf",
};

export function configuredLink(value: string): string | undefined {
  if (value.startsWith("TODO_") || !value.trim()) return undefined;
  return /^(https:\/\/|mailto:|\/[^/])/.test(value) ? value : undefined;
}

export const contentLabels = {
  exitGame: "Exit",
  backToPortfolio: "Back to portfolio",
  checkpoints: "Checkpoints",
  interact: "Explore",
  gameTitle: "ROHIT QUEST",
  playHint: "Hold a direction and tap Jump with your other thumb.",
  move: "Move",
  moveHint: "HOLD / SLIDE",
  jump: "Jump",
  jumpHint: "TAP TO JUMP",
  findLandmark: "Find a landmark",
  unavailableLink: "Not available",
  projectLinks: "Project links",
  resumeUnavailable: "The résumé is not available to download.",
};

export const navigation = [
  ["About", "about"],
  ["Projects", "projects"],
  ["Skills", "skills"],
  ["Experience", "experience"],
  ["Contact", "contact"],
] as const;

export const skills = [
  {
    name: "Backend",
    icon: "server",
    items: ["NestJS", "Node.js", "TypeScript", "Express.js", "PHP"],
  },
  { name: "Data", icon: "database", items: ["PostgreSQL", "TypeORM"] },
  { name: "Cloud & DevOps", icon: "cloud", items: ["AWS", "Docker", "CI/CD"] },
  {
    name: "Frontend",
    icon: "code",
    items: ["React", "Next.js", "Tailwind CSS"],
  },
  {
    name: "Reliability",
    icon: "activity",
    items: ["Sentry", "Prometheus", "Grafana"],
  },
] as const;

export type ProjectSlug = "clinzo360" | "openforms";
export interface CaseSection {
  title: string;
  text: string;
}
export interface Project {
  slug: ProjectSlug;
  name: string;
  number: string;
  location: string;
  tagline: string;
  description: string;
  status: string;
  scope: string;
  image: string;
  stack: string[];
  highlights: string[];
  sections: CaseSection[];
  challenges: string;
  url: string;
  github: string;
}

export const projects: Project[] = [
  {
    slug: "clinzo360",
    name: "Clinzo360",
    number: "01",
    location: "Clinzo Castle",
    tagline: "A clinic platform, built from the backend up",
    description:
      "A solo clinic-management project in development, connecting clinic onboarding, membership, and team access with a Next.js interface.",
    status: "In development",
    scope: "Solo project · Backend & frontend",
    image: "/assets/clinzo-castle.webp",
    stack: ["NestJS", "TypeScript", "TypeORM", "PostgreSQL", "Next.js"],
    highlights: [
      "Clinic onboarding, memberships & invitations",
      "Clinic-scoped sessions and role checks",
      "Patient, queue & consultation UI prototypes",
    ],
    challenges:
      "Separating user identity from clinic membership makes access context explicit. Patient, queue, and consultation screens currently use mock data while their backend workflows remain planned.",
    sections: [
      {
        title: "Problem",
        text: "Clinzo360 explores how clinic teams can coordinate account access and daily operations in one product. It is in development and has not been released.",
      },
      {
        title: "Role & scope",
        text: "I own and develop the backend and frontend. Current implementation covers authentication, clinic onboarding, memberships, team invitations, and settings. Clinical workflows remain in development.",
      },
      {
        title: "Architecture",
        text: "A Next.js frontend connects to a NestJS API, with TypeORM and PostgreSQL for persistence. User identity is separate from clinic membership, so a user can have a role within a specific clinic.",
      },
      {
        title: "Security & tenancy",
        text: "The API includes clinic-scoped session context, membership checks, and role guards.",
      },
      {
        title: "Workflow prototypes",
        text: "The patient, queue, and consultation interfaces use in-memory mock data. They explore the intended experience; they do not yet represent connected clinical workflows.",
      },
      {
        title: "Technical decisions",
        text: "Clinic onboarding groups related writes in a transaction. Separating identity, membership, and roles keeps clinic access context distinct from the user account.",
      },
    ],
    url: "TODO_ADD_CLINZO360_URL",
    github: "TODO_ADD_CLINZO360_GITHUB",
  },
  {
    slug: "openforms",
    name: "OpenForms",
    number: "02",
    location: "OpenForms Workshop",
    tagline: "A form-building API in development",
    description:
      "A solo project implementing form authoring and publishing, with response collection and a frontend experience planned.",
    status: "In development",
    scope: "Solo project · Backend development",
    image: "/assets/openforms-workshop.webp",
    stack: ["NestJS", "TypeScript", "TypeORM", "PostgreSQL"],
    highlights: [
      "Owner-scoped form editing",
      "Draft revisions and published snapshots",
      "Server-side form schema validation",
    ],
    challenges:
      "Draft edits need to stay separate from published forms. The API uses revision checks for edits and a snapshot for publication; response collection remains planned.",
    sections: [
      {
        title: "Role & scope",
        text: "I own and develop OpenForms as a solo project. The current implementation focuses on the API for creating, editing, and publishing forms. The product has not been released.",
      },
      {
        title: "Form model",
        text: "Forms store a draft schema and settings alongside a published snapshot. Draft revisions allow the API to reject stale edits rather than overwrite a newer version.",
      },
      {
        title: "API design",
        text: "The API implements owner-scoped form creation, listing, editing, and deletion, plus publishing and unpublishing. A public read endpoint retrieves a published form by its slug.",
      },
      {
        title: "Validation",
        text: "Server-side validation checks the form schema when saving a draft and applies publication checks before creating a published snapshot. This is form-definition validation; response validation remains planned.",
      },
      {
        title: "Responses",
        text: "Submission persistence and response review are planned. The current submission service is a scaffold, so the project does not yet provide a complete response-collection flow.",
      },
      {
        title: "Architecture",
        text: "The implemented backend uses NestJS, TypeScript, TypeORM, and PostgreSQL. A Next.js and Tailwind CSS frontend remains a proposed direction.",
      },
      {
        title: "Roadmap",
        text: "The next goal is to connect a form-building interface with publishing, submission storage, and response review.",
      },
    ],
    url: "TODO_ADD_OPENFORMS_URL",
    github: "TODO_ADD_OPENFORMS_GITHUB",
  },
];

export interface Role {
  company: string;
  title: string;
  period: string;
  highlights: string[];
}

export const experience = {
  heading: "Backend engineering and beyond.",
  summary:
    "Backend engineer building APIs, event-driven services, authentication flows, and integrations, with earlier experience in insurance operations.",
  // Career facts and non-numeric responsibilities confirmed by the owner on 2026-10-11.
  roles: [
    {
      company: "Shree Infosoft",
      title: "Senior Backend Engineer",
      period: "Feb 2026 — Present",
      highlights: [
        "Lead backend delivery on a multi-service booking platform: own service design, review code, and guide the team.",
        "Architected the booking and third-party integration services, plus lookup, tenant policy, and notification services.",
        "Built a Kafka-driven audit service recording events emitted when bookings, policies, and other entities change.",
        "Integrated Kong API Gateway with Keycloak, secured internal calls with X-API-Key, and managed secrets with Infisical.",
        "Wrote Jest unit and end-to-end tests for backend services.",
      ],
    },
    {
      company: "IceSpice Technologies",
      title: "Backend Engineer",
      period: "Aug 2023 — Jan 2026",
      highlights: [
        "Built an AWS Lambda rewards engine validating encrypted game events and recording credits and debits in a ledger.",
        "Moved bulk ledger updates out of the login path into RabbitMQ workers.",
        "Implemented Redis caching and real-time order updates.",
      ],
    },
    {
      company: "Myzer",
      title: "Backend Engineer",
      period: "Dec 2022 — Aug 2023",
      highlights: [
        "Built a multi-tenant landing-page SaaS with organisation roles, JSON templates, publishing, and usage analytics.",
        "Integrated OpenAI for page copy and Midjourney for imagery.",
      ],
    },
    {
      company: "FunctionUp",
      title: "Developer Trainee",
      period: "May 2022 — Dec 2022",
      highlights: [
        "Developed Node.js and Express APIs with MongoDB and JWT authentication.",
      ],
    },
    {
      company: "Accenture",
      title: "Associate",
      period: "May 2019 — May 2022",
      highlights: [
        "Handled insurance transaction processing and document verification workflows.",
      ],
    },
  ] satisfies Role[],
  education: {
    degree: "Bachelor of Commerce (B.Com)",
    school: "University of Mumbai",
    year: "2019",
  },
};

export const highlights = [
  {
    title: "Backend at the core",
    text: "APIs, data models, and access control that support real product workflows.",
  },
  {
    title: "From idea to interface",
    text: "Connecting a NestJS backend to clear, practical experiences in Next.js.",
  },
  {
    title: "Beyond the happy path",
    text: "Deployment, observability, and the details that keep software maintainable.",
  },
];

export const checkpoints = [
  { id: "about", label: "Welcome Meadows", short: "Welcome", x: 340 },
  { id: "skills", label: "Skill Forest", short: "Skills", x: 960 },
  { id: "clinzo360", label: "Clinzo Castle", short: "Clinzo360", x: 1680 },
  { id: "openforms", label: "OpenForms Workshop", short: "OpenForms", x: 2720 },
  { id: "experience", label: "Career Mountains", short: "Career", x: 3690 },
  { id: "contact", label: "Contact Kingdom", short: "Contact", x: 4520 },
] as const;
export type CheckpointId = (typeof checkpoints)[number]["id"];

export const siteMetadata = {
  title: "Rohit Quest | Backend & Full-Stack Engineer",
  description:
    "Explore Rohit's engineering portfolio: backend services, clinic software and form-building projects in development. Play the pixel-art quest or browse the portfolio directly.",
  socialDescription:
    "Reliable backends. Thoughtful products. A little adventure.",
};
