import { Heart } from "lucide-react";
import Link from "next/link";
export function Footer() {
  return (
    <footer className="site-footer">
      <Link href="/" className="pixel">
        ROHIT QUEST
      </Link>
      <span>Built with curiosity, code & a little adventure.</span>
      <span className="footer-end">
        <Heart size={13} /> Thanks for stopping by.
      </span>
    </footer>
  );
}
