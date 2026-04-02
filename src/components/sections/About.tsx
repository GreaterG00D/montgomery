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
        style={{ background: "rgba(5,5,8,0.72)" }}
        aria-hidden="true"
      />
    </section>
  );
}
