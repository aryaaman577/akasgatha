import type { CSSProperties } from "react";
import BlackHoleScene from "./BlackHoleScene";

const titleLetters = Array.from("AkasGatha");

/**
 * Drop-in AkasGatha homepage Hero.
 *
 * Render this immediately below the project's existing Navbar. The WebGL canvas
 * is transparent and remains behind the content; the interaction layer is
 * restricted to the black-hole side so links and Navbar controls remain usable.
 */
export default function AkasGathaHero() {
  return (
    <section className="hero" aria-labelledby="akasgatha-hero-title">
      <BlackHoleScene />
      <div className="hero-vignette" aria-hidden="true" />
      <div className="hero-stardust" aria-hidden="true" />

      <div className="hero-content">
        <p className="hero-eyebrow">
          ANCIENT SKY NARRATIVES · MODERN SPACE SCIENCE
        </p>

        <h1
          id="akasgatha-hero-title"
          className="hero-title"
          aria-label="AkasGatha"
        >
          {titleLetters.map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              className="hero-title-letter"
              aria-hidden="true"
              style={{ "--letter-index": index } as CSSProperties}
            >
              {letter}
            </span>
          ))}
        </h1>

        <p className="hero-tagline">
          Stories spark curiosity. Science brings clarity.
        </p>
        <p className="hero-support">
          Explore ancient sky narratives and modern space science through two
          clearly separated lenses.
        </p>
        <p className="hero-safety">
          Cultural narratives stay narratives. Scientific explanations stay
          evidence-aware.
        </p>

        <div className="hero-actions">
          <a className="hero-button hero-button-primary" href="/ask">
            <span>Start Jigyasa</span>
            <span className="button-arrow" aria-hidden="true">
              →
            </span>
          </a>
          <a className="hero-button hero-button-secondary" href="/granth">
            <span>Explore Akas Granth</span>
            <span className="button-arrow" aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
