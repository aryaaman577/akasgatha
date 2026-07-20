import Link from 'next/link'
import { useLanguage } from '@/config/language'
import './AboutPreview.css'

const copy = {
  en: {
    eyebrow: 'WHY AKASGATHA',
    heading: 'Wonder begins the journey. Evidence guides it.',
    support:
      'AkasGatha uses cultural sky narratives to build curiosity, then presents modern scientific explanations through a separate evidence-aware lens.',
    cta: 'Discover the approach',
    modelLabel:
      'Interactive celestial knowledge archive model showing curiosity becoming structured learning',
    principles: [
      {
        title: 'Curiosity',
        text: 'Curiosity first—begin with wonder.',
      },
      {
        title: 'Separation',
        text: 'Clear separation—story and science keep distinct roles.',
      },
      {
        title: 'Clarity',
        text: 'Evidence-aware—explanations include limits and uncertainty.',
      },
    ],
  },
  hi: {
    eyebrow: 'आकाशगाथा क्यों',
    heading: 'विस्मय यात्रा शुरू करता है। प्रमाण उसे दिशा देते हैं।',
    support:
      'आकाशगाथा सांस्कृतिक आकाश-कथाओं से जिज्ञासा जगाता है, फिर अलग प्रमाण-सचेत दृष्टि से आधुनिक वैज्ञानिक व्याख्या देता है।',
    cta: 'दृष्टिकोण जानें',
    modelLabel:
      'जिज्ञासा को संरचित सीख में बदलता हुआ इंटरैक्टिव खगोलीय ज्ञान-अभिलेख मॉडल',
    principles: [
      {
        title: 'जिज्ञासा',
        text: 'पहले जिज्ञासा—आरंभ विस्मय से।',
      },
      {
        title: 'पृथक्करण',
        text: 'स्पष्ट अलगाव—कथा और विज्ञान की भूमिकाएँ अलग।',
      },
      {
        title: 'स्पष्टता',
        text: 'प्रमाण-सचेत—सीमाएँ और अनिश्चितता भी शामिल।',
      },
    ],
  },
  hinglish: {
    eyebrow: 'AKASGATHA KYON',
    heading: 'Wonder se safar shuru hota hai. Evidence raasta dikhata hai.',
    support:
      'AkasGatha sky stories se curiosity jagata hai, phir modern science ko alag evidence-aware lens se samjhata hai.',
    cta: 'Approach dekhein',
    modelLabel:
      'Interactive celestial knowledge archive model jahan curiosity structured learning banti hai',
    principles: [
      {
        title: 'Curiosity',
        text: 'Curiosity pehle—wonder se start karo.',
      },
      {
        title: 'Separation',
        text: 'Clear separation—story aur science ke roles alag.',
      },
      {
        title: 'Clarity',
        text: 'Evidence-aware—limits aur uncertainty saath bataye jaate hain.',
      },
    ],
  },
  'hi-en': {
    eyebrow: 'WHY AKASGATHA / क्यों',
    heading: 'Wonder begins the journey. प्रमाण उसे दिशा देते हैं।',
    support:
      'Sky narratives जिज्ञासा जगाते हैं; science एक अलग evidence-aware lens से समझाई जाती है।',
    cta: 'Discover the approach',
    modelLabel:
      'Interactive ज्ञान-अभिलेख model showing curiosity becoming structured learning',
    principles: [
      {
        title: 'Curiosity / जिज्ञासा',
        text: 'Begin with wonder—जिज्ञासा पहले।',
      },
      {
        title: 'Separation / अलगाव',
        text: 'Story and science—दोनों की भूमिका अलग।',
      },
      {
        title: 'Clarity / स्पष्टता',
        text: 'Evidence-aware, with limits and uncertainty.',
      },
    ],
  },
}

function PrincipleVisual({ type }: { type: 'curiosity' | 'separation' | 'clarity' }) {
  return (
    <span className={`principle-visual ${type}`} aria-hidden="true">
      <span className="visual-layer visual-a" />
      <span className="visual-layer visual-b" />
      <span className="visual-layer visual-c" />
    </span>
  )
}

export function AboutPreview() {
  const { language } = useLanguage()
  // Fallback to 'en' if the specific language key is not in our local copy map
  const text = copy[language] || copy['en']

  return (
    <div className="about-preview-wrapper about-preview-wrapper--fullwidth" lang={language === 'hi' ? 'hi' : 'en'}>
      <div className="previous-sky" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <section className="mission-preview mission-preview--fullwidth" aria-labelledby="mission-heading">
        <div className="section-stars" aria-hidden="true" />
        <div className="dawn-horizon" aria-hidden="true" />

        <div className="mission-content">
          <div className="copy-column copy-column--centered">
            <p className="eyebrow">{text.eyebrow}</p>
            <h1 id="mission-heading">{text.heading}</h1>
            <p className="support-line">{text.support}</p>

            <div className="principles" aria-label="Mission principles">
              {text.principles.map((principle, index) => (
                <article className="principle-card" key={principle.title}>
                  <PrincipleVisual type={(['curiosity', 'separation', 'clarity'] as const)[index]} />
                  <div>
                    <h2>{principle.title}</h2>
                    <p>{principle.text}</p>
                  </div>
                </article>
              ))}
            </div>

            <Link className="mission-cta" href="/about" aria-label={text.cta}>
              <span>{text.cta}</span>
              <span className="cta-line" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
