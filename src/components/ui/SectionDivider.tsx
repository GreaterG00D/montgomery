"use client";

const WORDS = [
  "The Big Red Machine",
  "The Vanilla Gorilla",
  "The Memphis Strangler",
  "The Tijuana Tarantula",
  "The Big Red Machine",
  "The Vanilla Gorilla",
  "The Memphis Strangler",
  "The Tijuana Tarantula",
];

export default function SectionDivider() {
  return (
    <div className="marquee-wrapper" aria-hidden="true">
      <div className="marquee-track">
        {/* Double the items so the loop is seamless */}
        {[...WORDS, ...WORDS].map((word, i) => (
          <span key={i} className="marquee-item">
            <span className="dot" />
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
