import { useRef } from 'react';
import './AboutPreview.css';

export function AboutPreview() {
  const rootRef = useRef<HTMLElement | null>(null);

  return (
    <section ref={rootRef} className="akg-about-preview" aria-labelledby="about-title">
      <div className="akg-about-shell">
        <header className="akg-about-header">
          <p className="akg-about-eyebrow">ABOUT AKASGATHA</p>
          <h2 id="about-title" className="akg-about-heading font-display">
            Where ancient sky stories meet the science of the cosmos
          </h2>
          <p className="akg-about-support font-sans">
            AkasGatha is a cinematic learning experience that explores the sky through two distinct lenses. Katha preserves the wonder, symbolism and cultural memory carried through generations. Vigyan explains the same celestial world through observation, evidence and modern astronomy.
          </p>
        </header>

        <div className="akg-about-content">
          <div className="akg-about-section">
            <h3 className="akg-about-subheading katha-font font-serif italic">KATHA OPENS THE DOOR</h3>
            <p className="akg-about-text font-serif italic">
              Stories of Rahu and Ketu, nakshatras, eclipses and lunar cycles have inspired curiosity for centuries. AkasGatha presents these narratives as cultural knowledge and storytelling, not as scientific proof.
            </p>
          </div>

          <div className="akg-about-section">
            <h3 className="akg-about-subheading vigyan-font font-sans">VIGYAN BRINGS CLARITY</h3>
            <p className="akg-about-text font-sans">
              Orbits, gravity, stars, planets, eclipses, black holes and space missions are explained using clear modern science. Evidence and verified understanding must remain visibly separate from tradition and symbolism.
            </p>
          </div>

          <div className="akg-about-section">
            <h3 className="akg-about-subheading font-sans">JIGYASA CONNECTS THE JOURNEY</h3>
            <p className="akg-about-text font-sans">
              Jigyasa helps learners ask questions in English, Hindi or Hinglish and receive structured explanations that respect both cultural context and scientific accuracy.
            </p>
          </div>
        </div>

        <footer className="akg-about-footer">
          <p className="akg-about-closing katha-font font-serif italic">
            Not mythology presented as science<br />
            Not science separated from culture
          </p>
          <p className="akg-about-closing vigyan-font font-sans" style={{ marginTop: '0.5rem', fontWeight: 600 }}>
            A thoughtful path from wonder to understanding
          </p>
        </footer>
      </div>
    </section>
  );
}
