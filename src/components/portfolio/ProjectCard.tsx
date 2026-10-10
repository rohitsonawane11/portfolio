import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/portfolio";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`project-card ${project.slug}`}
    >
      <div className="project-art">
        <span className="project-level pixel">LEVEL {project.number}</span>
        <span className="project-status">
          <span />
          {project.status}
        </span>
        <Image
          src={project.image}
          alt={`Original pixel-art ${project.location}`}
          width={640}
          height={490}
          sizes="(max-width: 767px) 90vw, 42vw"
        />
        <span className="art-caption pixel">{project.location}</span>
        <span className="card-arrow">
          <ArrowUpRight size={22} />
        </span>
      </div>
      <div className="project-copy">
        <div className="project-name-row">
          <h3>{project.name}</h3>
          <span className="small-label">CASE STUDY ↗</span>
        </div>
        <p className="project-tagline">{project.tagline}</p>
        <p>{project.description}</p>
        <div className="tags">
          {project.stack.slice(0, 4).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
