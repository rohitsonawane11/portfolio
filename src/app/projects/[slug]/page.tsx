import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { configuredLink, contentLabels, projects } from "@/data/portfolio";

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return {
    title: project?.name ?? "Project not found",
    description: project?.description,
  };
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const next = projects.find((item) => item.slug !== slug)!;
  return (
    <main id="main-content" className="case-study">
      <div className="section case-top">
        <Link href="/#projects" className="text-link">
          <ArrowLeft size={16} /> All projects
        </Link>
        <div className="case-hero">
          <div>
            <span className="eyebrow">
              LEVEL {project.number} · ENGINEERING CASE STUDY
            </span>
            <h1>{project.name}</h1>
            <p className="case-tagline">{project.tagline}</p>
            <p>{project.description}</p>
            <div className="case-meta">
              <span className="status-pill">{project.status}</span>
              <span>{project.scope}</span>
            </div>
            <div className="tags">
              {project.stack.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
          <div className={`case-art ${project.slug}`}>
            <Image
              src={project.image}
              alt={`Original ${project.location} pixel artwork; not a product screenshot`}
              width={640}
              height={500}
              priority
            />
            <span className="pixel">{project.location}</span>
          </div>
        </div>
      </div>
      <div className="section case-layout">
        <aside className="case-toc">
          <span className="small-label">IN THIS CASE STUDY</span>
          {project.sections.map((section, index) => (
            <a href={`#section-${index}`} key={section.title}>
              {section.title}
            </a>
          ))}
          <a href="#project-links">{contentLabels.projectLinks}</a>
        </aside>
        <article className="case-body">
          {project.sections.map((section, index) => (
            <section id={`section-${index}`} key={section.title}>
              <span className="section-number">0{index + 1}</span>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </section>
          ))}
          <section id="project-links">
            <h2>{contentLabels.projectLinks}</h2>
            <div className="case-links">
              {[
                {
                  label: "View project",
                  value: project.url,
                  icon: ArrowUpRight,
                },
                {
                  label: "Source on GitHub",
                  value: project.github,
                  icon: Github,
                },
              ].map(({ label, value, icon: Icon }) =>
                configuredLink(value) ? (
                  <a
                    className="button button-navy"
                    href={configuredLink(value)}
                    key={label}
                  >
                    {label}
                    <Icon size={17} />
                  </a>
                ) : (
                  <span
                    className="button button-disabled"
                    aria-disabled="true"
                    key={label}
                  >
                    {label} · {contentLabels.unavailableLink} <Icon size={17} />
                  </span>
                ),
              )}
            </div>
          </section>
        </article>
      </div>
      <div className="section next-project">
        <span className="eyebrow">NEXT CHECKPOINT</span>
        <Link href={`/projects/${next.slug}`}>
          {next.name}
          <ArrowUpRight size={35} />
        </Link>
      </div>
    </main>
  );
}
