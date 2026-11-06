import type { Config } from "tailwindcss";

// Every colour and type size references a token in src/app/globals.css.
export default {
  content: ["./src/components/**/*.{ts,tsx}", "./src/app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ground: "var(--bg)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        "accent-ink": "var(--accent-ink)",
        oak: "var(--field-2)",
        "oak-ink": "var(--field-2-ink)",
        "oak-1": "var(--field-2-step-1)",
        "oak-2": "var(--field-2-step-2)",
        "oak-3": "var(--field-2-step-3)",
        fatal: "var(--fatal)",
        "fatal-dot": "var(--fatal-dot)",
        pedestrian: "var(--pedestrian)",
        bicyclist: "var(--bicyclist)",
        vehicle: "var(--vehicle)",
        line: "var(--line)",
      },
      fontFamily: {
        serif: ["var(--font-boska)", "Georgia", "serif"],
      },
      fontSize: {
        small: ["var(--step-small)", { lineHeight: "1.45" }],
        body: ["var(--step-body)", { lineHeight: "1.5" }],
        lead: ["var(--step-lead)", { lineHeight: "1.35" }],
        head: ["var(--step-head)", { lineHeight: "1", letterSpacing: "-0.02em" }],
        display: ["var(--step-display)", { lineHeight: "0.92", letterSpacing: "-0.05em" }],
      },
      spacing: {
        margin: "var(--margin)",
        gap: "var(--gap)",
      },
    },
  },
  plugins: [],
} satisfies Config;
