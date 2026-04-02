"use client";

import Link from "next/link";

export default function WMLogo() {
  return (
    <Link
      href="/"
      aria-label="William Montgomery — home"
      style={{
        position: "fixed",
        top: "1.25rem",
        left: "1.25rem",
        zIndex: 100,
        width: "56px",
        height: "56px",
        display: "block",
        textDecoration: "none",
      }}
    >
      {/* Outer spinning square — white fill */}
      <div
        className="animate-spin-slow"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          border: "1.5px solid rgba(255,107,0,0.5)",
          transform: "rotate(45deg)",
          background: "rgba(255,255,255,0.95)",
        }}
      />
      {/* Inner tilted square — dark fill cuts out the center */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "10px",
          border: "1px solid rgba(255,45,45,0.35)",
          transform: "rotate(12deg)",
          background: "#08080f",
        }}
      />
      {/* WM text */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-bebas), sans-serif",
            fontSize: "1.45rem",
            letterSpacing: "0.04em",
            lineHeight: 1,
          }}
        >
          <span style={{ color: "#ffffff" }}>W</span>
          <span style={{ color: "#ff6b00" }}>M</span>
        </span>
      </div>
    </Link>
  );
}
