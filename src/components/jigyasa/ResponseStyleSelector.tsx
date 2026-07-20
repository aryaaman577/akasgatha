"use client";

type ResponseStyleOption = "balanced" | "quick" | "structured" | "deep" | "katha-vigyan";

interface ResponseStyleSelectorProps {
  value: ResponseStyleOption;
  onChange: (value: ResponseStyleOption) => void;
  disabled?: boolean;
}

const styles: { value: ResponseStyleOption; label: string; description: string }[] = [
  { value: "balanced", label: "Balanced", description: "Concise with useful detail" },
  { value: "quick", label: "Quick Summary", description: "Direct and compact" },
  { value: "structured", label: "Structured", description: "Clear sections and steps" },
  { value: "deep", label: "Deep Dive", description: "Detailed explanation" },
  { value: "katha-vigyan", label: "Katha + Vigyan", description: "Narrative and science separated" },
];

export function ResponseStyleSelector({ value, onChange, disabled }: ResponseStyleSelectorProps) {
  return (
    <div>
      <label
        htmlFor="style-select"
        className="block text-fluid-button font-medium mb-2"
        style={{ color: "var(--space-stardust)", opacity: 0.8 }}
      >
        Answer Style
      </label>
      <select
        id="style-select"
        value={value}
        onChange={(e) => onChange(e.target.value as ResponseStyleOption)}
        disabled={disabled}
        className="w-full min-h-[44px] rounded-lg border px-4 py-2 text-fluid-body outline-none transition-colors focus:border-[var(--space-antique-gold)]/50 focus:ring-1 focus:ring-[var(--space-antique-gold)]/30 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          borderColor: "rgba(189,165,106,0.2)",
          background: "rgba(7,9,18,0.80)",
          color: "var(--space-moonlight)",
        }}
      >
        {styles.map((style) => (
          <option key={style.value} value={style.value}>
            {style.label} — {style.description}
          </option>
        ))}
      </select>
    </div>
  );
}
