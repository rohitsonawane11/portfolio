"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import {
  checkpoints,
  configuredLink,
  experience,
  profile,
  projects,
  skills,
  type CheckpointId,
} from "@/data/portfolio";
import { ContactLinks } from "@/components/portfolio/ContactLinks";

export function QuestPanel({
  id,
  onClose,
}: {
  id: CheckpointId;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [tab, setTab] = useState("Overview");
  const project = projects.find((item) => item.slug === id);
  const title =
    project?.name ?? checkpoints.find((item) => item.id === id)!.label;
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    // Focus the dialog itself rather than a control inside it. Opening the panel
    // with Enter would otherwise hand that same keystroke to an auto-focused
    // button, activating it and closing the panel the instant it appeared.
    element?.focus({ preventScroll: true });
    document.body.style.overflow = "hidden";
    // A native modal already blocks the page behind it, but Chrome still parks
    // focus on <body> for one stop when tabbing past the last control. Wrap
    // explicitly so every Tab lands on something actionable.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !element) return;
      const focusable = Array.from(
        element.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    element?.addEventListener("keydown", onKeyDown);
    return () => {
      element?.removeEventListener("keydown", onKeyDown);
      element?.close();
      document.body.style.overflow = previousOverflow;
      previous?.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="quest-dialog"
      tabIndex={-1}
      aria-labelledby="panel-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="dialog-inner">
        <header className="dialog-header">
          <div>
            <span className="eyebrow">CHECKPOINT DISCOVERED</span>
            <h2 id="panel-title">{title}</h2>
            <p>
              {project?.scope ??
                "A little more about the engineer behind the adventure"}
            </p>
          </div>
          <button
            className="icon-button"
            aria-label="Close panel"
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </header>
        {project ? (
          <>
            <div className="dialog-tabs" aria-label="Project sections">
              {["Overview", "Architecture", "Challenges"].map((label) => (
                <button
                  key={label}
                  aria-pressed={tab === label}
                  onClick={() => setTab(label)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="dialog-project">
              <div className={`dialog-art ${project.slug}`}>
                <Image
                  src={project.image}
                  alt={`Pixel-art ${project.location}`}
                  width={460}
                  height={380}
                />
                <span className="status-pill">{project.status}</span>
              </div>
              <div>
                <h3>{tab === "Overview" ? project.tagline : tab}</h3>
                <p>
                  {tab === "Overview"
                    ? project.description
                    : tab === "Architecture"
                      ? project.sections.find(
                          (section) => section.title === "Architecture",
                        )!.text
                      : project.challenges}
                </p>
                {tab === "Overview" && (
                  <ul>
                    {project.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                <div className="tags">
                  {project.stack.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            </div>
            <footer className="dialog-footer">
              <Link
                className="button button-gold"
                href={`/projects/${project.slug}`}
              >
                Read case study <ArrowUpRight size={17} />
              </Link>
              {[
                { label: "View project", value: project.url },
                { label: "GitHub", value: project.github },
              ].map(({ label, value }) =>
                configuredLink(value) ? (
                  <a
                    key={label}
                    href={configuredLink(value)}
                    className="text-link"
                  >
                    {label} ↗
                  </a>
                ) : (
                  <span
                    className="disabled-link"
                    key={label}
                    aria-disabled="true"
                    title={value}
                  >
                    {label} · coming soon
                  </span>
                ),
              )}
            </footer>
          </>
        ) : (
          <div className="dialog-content">
            {id === "about" && (
              <>
                <h3>{profile.headline}</h3>
                <p>{profile.description}</p>
              </>
            )}
            {id === "skills" && (
              <div className="panel-skills">
                {skills.map((group) => (
                  <div key={group.name}>
                    <h3>{group.name}</h3>
                    <div className="tags">
                      {group.items.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {id === "experience" && (
              <>
                <h3>{experience.title}</h3>
                <p>{experience.description}</p>
                <p className="todo">{experience.todo}</p>
              </>
            )}
            {id === "contact" && (
              <>
                <h3>Great things start with a hello.</h3>
                <p>
                  Profile links will be available once the verified details are
                  added.
                </p>
                <ContactLinks />
              </>
            )}
          </div>
        )}
      </div>
    </dialog>
  );
}
