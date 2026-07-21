import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  // Ignore root-level legacy CommonJS utility scripts (not part of the Next.js app)
  {
    ignores: [
      "assemble.js",
      "assemble_granth.js",
      "convert.js",
      "extract_granth.js",
      "fix.js",
      "fix2.js",
      "fix_fg.js",
      "fix_fg2.js",
      "refactor.js",
      "refactor_orbit.js",
    ],
  },
  ...nextVitals,
  ...nextTypescript,
];

export default eslintConfig;
