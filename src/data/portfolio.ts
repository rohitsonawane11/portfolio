export const profile = {
  name: "Rohit",
  role: "Backend & Full-Stack Engineer",
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
  resume: "TODO_ADD_RESUME",
};

export function configuredLink(value: string): string | undefined {
  if (value.startsWith("TODO_") || !value.trim()) return undefined;
  return /^(https:\/\/|mailto:|\/[^/])/.test(value) ? value : undefined;
}

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
    tagline: "Multi-tenant clinic management SaaS",
    description:
      "A platform for clinic teams to manage access, patient workflows, consultations, and operations.",
    status: "Engineering case study",
    scope: "Backend & full-stack development",
    image: "/assets/clinzo-castle.webp",
    stack: ["NestJS", "TypeScript", "PostgreSQL", "Next.js", "Docker", "AWS"],
    highlights: [
      "Role-based access, memberships & invitations",
      "Consultation and patient queue workflows",
      "Cloud deployment, CI/CD & observability",
    ],
    challenges:
      "Tenant boundaries and permission checks are key engineering concerns for clinic software. This case study covers the reported scope; implementation examples and measured outcomes still need to be supplied.",
    sections: [
      {
        title: "Problem",
        text: "Clinic teams need a shared place to coordinate access, patient queues, consultations, and daily operations. Clinzo360 brings these workflows into a multi-tenant product.",
      },
      {
        title: "Role & scope",
        text: "Reported engineering work spans the NestJS backend, PostgreSQL data layer, Next.js frontend, and cloud delivery. Product areas include team membership and invitations, clinic settings, a medicine catalogue, and consultation and patient queue workflows. TODO: confirm project dates, individual ownership, and release status.",
      },
      {
        title: "Architecture",
        text: "The reported stack pairs a Next.js frontend with a NestJS API and PostgreSQL persistence. Docker and AWS support delivery. This is a high-level stack overview; a verified component diagram and request flow are still to be added.",
      },
      {
        title: "Security & tenancy",
        text: "Multi-tenancy and role-based access control are part of the reported scope, alongside team membership and invitation workflows. TODO: document the actual tenant isolation strategy, authorization checks, and testing approach. No medical compliance certification is claimed.",
      },
      {
        title: "Deployment & observability",
        text: "Reported tools include Docker, cloud deployment, GitHub Actions CI/CD, Sentry, Prometheus, and Grafana. TODO: add a redacted delivery pipeline and a verified monitoring example, with no credentials or patient data.",
      },
      {
        title: "Technical decisions",
        text: "NestJS, TypeScript, and PostgreSQL form the backend foundation. TODO: explain the actual tradeoffs behind data modelling, authorization, and deployment decisions using code or architecture evidence. No performance or adoption metrics have been supplied.",
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
    tagline: "Form builder and response collection",
    description:
      "A full-stack project exploring how people create, publish, share and collect responses through forms.",
    status: "In progress",
    scope: "Full-stack product exploration",
    image: "/assets/openforms-workshop.webp",
    stack: ["NestJS", "TypeScript", "PostgreSQL", "Next.js", "Tailwind CSS"],
    highlights: [
      "Exploring form creation and publishing",
      "Designing a form and response model",
      "Building toward a clear end-to-end experience",
    ],
    challenges:
      "The project explores the relationship between a flexible form model, clear authoring UX, and trustworthy response validation. These are design goals; completion and release are not yet confirmed.",
    sections: [
      {
        title: "UX",
        text: "The intended journey covers creating a form, publishing it, sharing a link, and collecting responses. The project is in progress; finished screens and usability findings are not yet available.",
      },
      {
        title: "Form model",
        text: "The project explores how forms, questions, and responses can be represented in PostgreSQL. TODO: add the implemented schema and explain field types, ordering, and how edits affect existing responses.",
      },
      {
        title: "API design",
        text: "NestJS and TypeScript are the backend stack for this project. TODO: confirm the implemented endpoints and document the form publishing and response submission lifecycle.",
      },
      {
        title: "Validation",
        text: "Validation is a design area for both the form editor and submitted responses. TODO: show verified rules and the actual client and server validation approach before claiming coverage.",
      },
      {
        title: "Responses",
        text: "Response collection is central to the product goal. TODO: confirm the persistence and retrieval flows, and add a demonstration using synthetic response data.",
      },
      {
        title: "Architecture",
        text: "The intended full-stack architecture combines Next.js and Tailwind CSS with a NestJS API and PostgreSQL. This describes the project direction, not a claim that every component is production-ready.",
      },
      {
        title: "Roadmap",
        text: "First, complete and verify the core create, publish, and respond flow. Analytics, conditional logic, collaboration, and multi-tenancy are possible future explorations; none are represented as shipped features.",
      },
    ],
    url: "TODO_ADD_OPENFORMS_URL",
    github: "TODO_ADD_OPENFORMS_GITHUB",
  },
];

export const experience = {
  title: "The story is still being documented.",
  description:
    "Project work is shared above. A verified professional timeline will be added with company names, roles, dates, and outcomes.",
  todo: "TODO: Add employer · role · dates · verified outcomes",
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
