import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FileText, Menu } from "lucide-react";
import { navigation, profile, configuredLink } from "@/data/portfolio";

export function Navbar() {
  return (
    <header className="site-header">
      <div className="nav-inner">
        <Link href="/" className="brand" aria-label="Rohit Quest home">
          <span className="brand-avatar">
            <Image
              src="/assets/rohit-avatar.webp"
              alt=""
              width={26}
              height={65}
            />
          </span>
          <span>
            ROHIT<span className="brand-gold"> QUEST</span>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map(([label, id]) => (
            <Link key={id} href={`/#${id}`}>
              {label}
            </Link>
          ))}
        </nav>
        <Link
          href={configuredLink(profile.resume) ?? "/resume"}
          className="resume-link"
        >
          <FileText size={15} /> Résumé <ArrowUpRight size={15} />
        </Link>
        <details className="mobile-menu">
          <summary aria-label="Open navigation">
            <Menu size={23} />
          </summary>
          <nav aria-label="Mobile navigation">
            {navigation.map(([label, id]) => (
              <Link key={id} href={`/#${id}`}>
                {label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
