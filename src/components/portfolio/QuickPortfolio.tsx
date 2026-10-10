import {
  Activity,
  ArrowDown,
  Cloud,
  Code2,
  Database,
  Server,
  Sparkles,
  Terminal,
} from "lucide-react";
import {
  experience,
  highlights,
  profile,
  projects,
  skills,
} from "@/data/portfolio";
import { ProjectCard } from "./ProjectCard";
import { ContactLinks } from "./ContactLinks";

const icons = {
  server: Server,
  database: Database,
  cloud: Cloud,
  code: Code2,
  activity: Activity,
};

export function QuickPortfolio() {
  return (
    <div id="quick-portfolio" tabIndex={-1}>
      <section
        className="section projects-section"
        id="projects"
        aria-labelledby="projects-heading"
      >
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              <span className="tiny-square" /> THE MAIN QUESTS
            </span>
            <h2 id="projects-heading">Small details. Real engineering.</h2>
          </div>
          <p>
            Two projects. Plenty of problems to solve.
            <br />
            Here’s a look behind the pixels.
          </p>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
      <section
        className="about-section"
        id="about"
        aria-labelledby="about-heading"
      >
        <div className="section about-grid">
          <div>
            <span className="eyebrow">
              <span className="tiny-square" /> THE PLAYER BEHIND THE PIXELS
            </span>
            <h2 id="about-heading">
              Curious mind.
              <br />
              Builder at heart<span className="green-text">.</span>
            </h2>
            <p className="about-intro">{profile.headline}</p>
            <p>{profile.description}</p>
            <a href="#skills" className="text-link">
              Explore my toolkit <ArrowDown size={16} />
            </a>
          </div>
          <div className="highlights">
            {highlights.map((item, i) => (
              <div className="highlight" key={item.title}>
                <span className="highlight-icon">
                  {i === 0 ? (
                    <Terminal size={21} />
                  ) : i === 1 ? (
                    <Code2 size={21} />
                  ) : (
                    <Sparkles size={21} />
                  )}
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section" id="skills" aria-labelledby="skills-heading">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              <span className="tiny-square" /> INVENTORY
            </span>
            <h2 id="skills-heading">Tools for the next challenge.</h2>
          </div>
          <p>
            The stack I build with.
            <br />
            Always room to learn something new.
          </p>
        </div>
        <div className="skills-grid">
          {skills.map((group) => {
            const Icon = icons[group.icon];
            return (
              <div className="skill-group" key={group.name}>
                <Icon size={24} strokeWidth={1.6} />
                <h3>{group.name}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
      <section
        className="section experience-section"
        id="experience"
        aria-labelledby="experience-heading"
      >
        <div>
          <span className="eyebrow">
            <span className="tiny-square" /> CHECKPOINTS
          </span>
          <h2 id="experience-heading">The journey so far.</h2>
          <p>{experience.summary}</p>
          <p className="education">
            {experience.education.degree} · {experience.education.school} ·{" "}
            {experience.education.year}
          </p>
        </div>
        <div className="timeline">
          <span className="small-label">PROFESSIONAL EXPERIENCE</span>
          <ol>
            {experience.roles.map((role) => (
              <li key={role.company} className="timeline-entry">
                <span className="timeline-dot" />
                <h3>{role.title}</h3>
                <p className="timeline-meta">
                  {role.company} · {role.period}
                </p>
                <ul>
                  {role.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section
        className="contact-section"
        id="contact"
        aria-labelledby="contact-heading"
      >
        <div className="section contact-inner">
          <span className="eyebrow">THE NEXT ADVENTURE</span>
          <h2 id="contact-heading">
            Great things start
            <br />
            with a <span>hello.</span>
          </h2>
          <p>
            Have an interesting problem or a project in mind?
            <br />
            Let’s find a way to build something useful.
          </p>
          <ContactLinks />
          <p className="contact-note">
            Contact details and résumé are being added. Check back soon.
          </p>
        </div>
        <span className="contact-star star-one" aria-hidden="true">
          ✦
        </span>
        <span className="contact-star star-two" aria-hidden="true">
          ✦
        </span>
      </section>
    </div>
  );
}
