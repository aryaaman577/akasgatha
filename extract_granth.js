const fs = require('fs');

const rawHtml = `
    <section class="archive-preview" aria-labelledby="granth-title">
      <div class="cosmic-clip" aria-hidden="true"></div>
      <canvas id="starfield" aria-hidden="true"></canvas>

      <div class="archive-shell">
        <header class="section-header">
          <div>
            <p class="eyebrow" data-copy="eyebrow">AKAS GRANTH</p>
            <h1 id="granth-title" data-copy="heading">Every orbit holds a question.</h1>
            <p class="support" data-copy="support">Enter a living archive of planets, eclipses, stars, Moon phases, mysteries, cycles, and missions.</p>
          </div>

          <div class="language-control">
            <label for="languageSelect">Language</label>
            <select id="languageSelect" aria-label="Choose language">
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="hinglish">Hinglish</option>
              <option value="hi-en">हिन्दी + English</option>
            </select>
          </div>
        </header>

        <div class="experience">
          <svg class="celestial-connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="connectionGradient" x1="0" x2="1">
                <stop offset="0" stop-color="#73c9dd" stop-opacity=".12"/>
                <stop offset=".5" stop-color="#e0b866" stop-opacity=".85"/>
                <stop offset="1" stop-color="#73c9dd" stop-opacity=".12"/>
              </linearGradient>
            </defs>
            <path d="M49 49 C36 39 28 27 16 24"/>
            <path d="M51 48 C65 37 73 27 85 24"/>
            <path d="M52 53 C67 62 76 70 86 78"/>
            <circle cx="49" cy="49" r=".8"/>
            <circle cx="16" cy="24" r=".45"/>
            <circle cx="85" cy="24" r=".45"/>
            <circle cx="86" cy="78" r=".45"/>
          </svg>

          <article class="topic topic--planet">
            <span class="scene-label" data-copy="planetLabel">Orbital scene</span>
            <div class="mini-scene" aria-hidden="true">
              <div class="planet-system">
                <div class="planet-ring"></div>
                <div class="planet"></div>
                <div class="planet-moon"></div>
                <div class="planet-dust"></div>
              </div>
            </div>
            <h2 data-copy="planetTitle">Planets and Grah</h2>
            <p data-copy="planetDescription">Explore planetary worlds while distinguishing cultural grah traditions from modern astronomy.</p>
            <div class="topic-actions">
              <a class="topic-link" href="/granth#planets" data-copy="explore" aria-label="Explore Planets and Grah">Explore topic</a>
              <a class="ask-link" href="/ask?topic=planets" data-copy="ask">Ask about this</a>
            </div>
          </article>

          <div class="archive-column">
            <div class="archive-halo" aria-hidden="true"></div>
            <div class="archive-stage" id="archiveStage" tabindex="0" role="img" aria-label="Interactive floating celestial knowledge archive. Drag horizontally to rotate.">
              <div class="archive-tilt">
                <div class="archive-model" aria-hidden="true">
                  <div class="slab"></div>
                  <div class="slab"></div>
                  <div class="slab"></div>
                  <div class="slab"></div>
                  <div class="slab"></div>
                  <div class="slab"></div>

                  <div class="binding-ring r1"></div>
                  <div class="binding-ring r2"></div>
                  <div class="binding-ring r3"></div>

                  <div class="glyph g1"></div>
                  <div class="glyph g2"></div>
                  <div class="glyph g3"></div>
                  <div class="glyph g4"></div>

                  <div class="archive-core"></div>

                  <div class="fragment f1"></div>
                  <div class="fragment f2"></div>
                  <div class="fragment f3"></div>
                  <div class="fragment f4"></div>
                </div>
              </div>
              <span class="archive-caption" data-copy="dragHint">Drag to turn the living archive</span>
            </div>
          </div>

          <article class="topic topic--eclipse">
            <span class="scene-label" data-copy="eclipseLabel">Alignment simulator</span>
            <div class="mini-scene" aria-hidden="true">
              <div class="eclipse-system">
                <div class="alignment-line"></div>
                <div class="sun"></div>
                <div class="moon-orbit"></div>
                <div class="eclipse-earth"></div>
                <div class="eclipse-shadow"></div>
                <div class="eclipse-moon"></div>
              </div>
            </div>
            <h2 data-copy="eclipseTitle">Eclipses and Rahu-Ketu</h2>
            <p data-copy="eclipseDescription">Compare cultural eclipse narratives with the science of Sun, Earth, and Moon alignment.</p>
            <div class="topic-actions">
              <a class="topic-link" href="/granth#eclipses" data-copy="explore" aria-label="Explore Eclipses and Rahu-Ketu">Explore topic</a>
              <a class="ask-link" href="/ask?topic=eclipses" data-copy="ask">Ask about this</a>
            </div>
          </article>

          <article class="topic topic--stars">
            <span class="scene-label" data-copy="starsLabel">Constellation field</span>
            <div class="mini-scene" aria-hidden="true">
              <svg class="constellation" viewBox="0 0 190 130">
                <path class="path" d="M17 92 L46 53 L77 72 L106 32 L137 54 L174 20"/>
                <path class="path gold" d="M46 53 L71 20 L106 32 L121 95 L154 109"/>
                <path class="path" d="M17 92 L58 108 L121 95 L137 54 L174 72"/>
                <circle class="far" cx="17" cy="92" r="2.2"/>
                <circle cx="46" cy="53" r="3"/>
                <circle class="gold" cx="71" cy="20" r="3.7"/>
                <circle cx="77" cy="72" r="2.4"/>
                <circle class="gold" cx="106" cy="32" r="4"/>
                <circle cx="121" cy="95" r="2.8"/>
                <circle class="gold" cx="137" cy="54" r="3.2"/>
                <circle class="far" cx="154" cy="109" r="2"/>
                <circle cx="174" cy="20" r="2.6"/>
                <circle class="far" cx="174" cy="72" r="1.8"/>
                <circle class="far" cx="58" cy="108" r="1.8"/>
              </svg>
            </div>
            <h2 data-copy="starsTitle">Nakshatra and Stars</h2>
            <p data-copy="starsDescription">Trace traditional sky patterns beside scientific constellations, stellar distance, and motion.</p>
            <div class="topic-actions">
              <a class="topic-link" href="/granth#stars" data-copy="explore" aria-label="Explore Nakshatra and Stars">Explore topic</a>
              <a class="ask-link" href="/ask?topic=stars" data-copy="ask">Ask about this</a>
            </div>
          </article>

          <aside class="action-panel" aria-label="Open the complete archive">
            <p class="action-kicker" data-copy="ctaSupport">Follow the celestial paths into the complete knowledge archive.</p>
            <a class="primary-cta" href="/granth" data-copy="cta">Open Akas Granth</a>
          </aside>
        </div>
      </div>
    </section>
`;

let jsx = rawHtml
  .replace(/class=/g, 'className=')
  .replace(/tabindex=/g, 'tabIndex=')
  .replace(/viewBox=/g, 'viewBox=')
  .replace(/preserveAspectRatio=/g, 'preserveAspectRatio=')
  .replace(/stop-color/g, 'stopColor')
  .replace(/stop-opacity/g, 'stopOpacity')
  .replace(/for="/g, 'htmlFor="');

// Remove language control since we use global provider
jsx = jsx.replace(/<div className="language-control">[\s\S]*?<\/div>/, '');

fs.writeFileSync('C:/Users/amang/Desktop/akashgatha/granth_jsx.txt', jsx);
console.log('Saved to granth_jsx.txt');
