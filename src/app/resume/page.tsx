import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Résumé" };
export default function ResumePage() {
  return (
    <main id="main-content" className="section placeholder-page">
      <span className="placeholder-icon">
        <FileText size={32} />
      </span>
      <span className="eyebrow">PLAYER PROFILE</span>
      <h1>Résumé coming soon.</h1>
      <p>
        A current résumé hasn’t been provided yet. You can explore the project
        case studies and engineering toolkit in the meantime.
      </p>
      <p className="todo">
        TODO_ADD_RESUME — add a current PDF and update src/data/portfolio.ts.
      </p>
      <Link href="/#projects" className="button button-gold">
        <ArrowLeft size={17} /> Back to the projects
      </Link>
    </main>
  );
}
