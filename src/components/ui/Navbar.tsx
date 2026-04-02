"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Showcase", href: "#showcase" },
  { label: "Merch", href: "#merch" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Entrance animation
    gsap.fromTo(
      navRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.2, ease: "power3.out" }
    );
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 transition-all duration-500"
        style={{
          background: scrolled
            ? "rgba(5, 5, 8, 0.85)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
        }}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="text-white font-display text-lg tracking-widest hover:opacity-70 transition-opacity"
          style={{ fontFamily: "var(--font-bebas), sans-serif", letterSpacing: "0.12em" }}
          aria-label="William Montgomery — home"
        >
          WM
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8" role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="nav-link"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="https://www.cameo.com/wfmontgomery"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex btn-primary text-[10px]"
          style={{ padding: "8px 20px" }}
        >
          Book Cameo
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span
            className="block w-6 h-px bg-white transition-all duration-300"
            style={{ transform: menuOpen ? "rotate(45deg) translate(3px, 4px)" : "none" }}
          />
          <span
            className="block w-4 h-px bg-white transition-all duration-300"
            style={{ opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="block w-6 h-px bg-white transition-all duration-300"
            style={{ transform: menuOpen ? "rotate(-45deg) translate(3px, -4px)" : "none" }}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className="fixed inset-0 z-40 md:hidden flex flex-col items-center justify-center transition-all duration-500"
        style={{
          background: "rgba(5, 5, 8, 0.97)",
          backdropFilter: "blur(30px)",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "all" : "none",
          transform: menuOpen ? "none" : "translateY(-20px)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <ul className="flex flex-col items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="font-display text-white text-5xl tracking-wider hover:text-[#ff6b00] transition-colors"
                style={{ fontFamily: "var(--font-bebas), sans-serif" }}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="https://www.cameo.com/wfmontgomery"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-4"
            >
              Book Cameo
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
