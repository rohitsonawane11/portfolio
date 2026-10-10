import Link from "next/link";
import { FileText, ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { configuredLink, experience, profile } from "@/data/portfolio";
export const metadata: Metadata = { title: "Résumé" };
export default function ResumePage() {
  const resume = configuredLink(profile.resume);
  return (
    <main id="main-content" className="section placeholder-page">
      <span className="placeholder-icon">
        <FileText size={32} />
      </span>
      <span className="eyebrow">PLAYER PROFILE</span>
      <h1>Résumé</h1>
      <p>{experience.summary}</p>
      {resume ? (
        <a href={resume} className="button button-gold">
          Open the PDF <ArrowUpRight size={17} />
        </a>
      ) : (
        <p className="todo">
          TODO_ADD_RESUME — add a current PDF and update src/data/portfolio.ts.
        </p>
      )}
      <Link href="/#experience" className="text-link">
        <ArrowLeft size={17} /> Back to the journey
      </Link>
    </main>
  );
}
