import Link from "next/link";

export default function FAQPage() {
  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: "2rem", fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1.5rem" }}>Frequently Asked Questions</h1>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>What is Percentle?</h2>
        <p>Percentle is a game where you guess countries with the highest percentage of a given letter in their names.</p>
      </div>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>How do hints work?</h2>
        <p>Hints progressively reveal information about a random unguessed country, starting with its percentage, then the length, then letters one by one.</p>
      </div>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>How is my progress saved?</h2>
        <p>Your guesses and hints are saved in your browser, so you can refresh without losing progress.</p>
      </div>
      <Link href="/play" style={{ color: "#2563eb", textDecoration: "underline" }}>
        ← Back to Play
      </Link>
    </div>
  );
}