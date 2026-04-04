"use client";

export default function About() {
  return (
    <section
      id="about"
      className="relative w-full"
      style={{ minHeight: "100vh" }}
      aria-label="About section"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        // Transparent enough for the fixed rings to remain visible.
        style={{ background: "rgba(10,10,10,0.14)" }}
        aria-hidden="true"
      />
    </section>
  );
}
