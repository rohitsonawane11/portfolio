import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main-content" className="section placeholder-page">
      <span className="eyebrow">OFF THE MAP · 404</span>
      <h1>A path yet to be built.</h1>
      <p>
        This checkpoint doesn’t exist. Head back to the meadow and keep
        exploring.
      </p>
      <Link className="button button-gold" href="/">
        Return to the adventure
      </Link>
    </main>
  );
}
