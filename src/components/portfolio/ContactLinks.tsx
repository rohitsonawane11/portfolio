import { Github, Linkedin, Mail, FileText, ArrowUpRight } from "lucide-react";
import { configuredLink, contentLabels, profile } from "@/data/portfolio";

export function ContactLinks() {
  const links = [
    { label: "Email", value: profile.email, icon: Mail },
    { label: "GitHub", value: profile.github, icon: Github },
    { label: "LinkedIn", value: profile.linkedin, icon: Linkedin },
    { label: "Résumé", value: profile.resume, icon: FileText },
  ];
  return (
    <div className="contact-links">
      {links.map(({ label, value, icon: Icon }) => {
        const href = configuredLink(value);
        return href ? (
          <a key={label} href={href} className="contact-link">
            <Icon size={19} />
            <span>{label}</span>
            <ArrowUpRight size={16} />
          </a>
        ) : (
          <span
            key={label}
            className="contact-link unavailable"
            aria-disabled="true"
          >
            <Icon size={19} />
            <span>
              {label}
              <small>{contentLabels.unavailableLink}</small>
            </span>
          </span>
        );
      })}
    </div>
  );
}
