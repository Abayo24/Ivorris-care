import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // ── Brand Colours ──────────────────────────────────────────────
      colors: {
        forest:      "#2C3B2D",
        "forest-mid":"#3D5240",
        sage:        "#6B8A6E",
        "sage-light":"#A8BFA9",
        cream:       "#F7F3ED",
        "warm-white":"#FDFAF6",
        gold:        "#B8965A",
        "gold-light":"#D4B483",
        charcoal:    "#1E2820",
        "text-mid":  "#4A5E4C",
        "text-light":"#7A8E7C",
        blush:       "#F2E8DE",
        "pkg-standard": "#E8F0E9",
      },

      // ── Brand Fonts ────────────────────────────────────────────────
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans:  ["'DM Sans'", "system-ui", "sans-serif"],
      },

      // ── Custom Sizes ───────────────────────────────────────────────
      width:  { "13": "3.25rem" },
      height: { "13": "3.25rem" },

      // ── Animation ──────────────────────────────────────────────────
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-10px)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(28px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
      },
      animation: {
        float:      "float 4s ease-in-out infinite",
        "float-slow":"float 5s ease-in-out 1s infinite",
        "fade-up-1":"fade-up 0.9s cubic-bezier(0.4,0,0.2,1) 0.2s both",
        "fade-up-2":"fade-up 0.9s cubic-bezier(0.4,0,0.2,1) 0.35s both",
        "fade-up-3":"fade-up 0.9s cubic-bezier(0.4,0,0.2,1) 0.5s both",
        "fade-up-4":"fade-up 0.9s cubic-bezier(0.4,0,0.2,1) 0.65s both",
        "fade-up-5":"fade-up 0.9s cubic-bezier(0.4,0,0.2,1) 0.8s both",
        "fade-in-hero":"fade-in 1.2s cubic-bezier(0.4,0,0.2,1) 0.4s both",
      },

      // ── Clip path util ─────────────────────────────────────────────
      clipPath: {
        hero: "polygon(8% 0, 100% 0, 100% 100%, 0% 100%)",
      },

      // ── Extra border radius ────────────────────────────────────────
      borderRadius: { "2px": "2px", "4px": "4px" },

      // ── Background image helpers ───────────────────────────────────
      backgroundImage: {
        "hero-cell-1": "linear-gradient(135deg, #8FAE91, #B8D4B9, #D4E8D5)",
        "hero-cell-2": "linear-gradient(135deg, #C4B4A0, #D4C4B0, #E4D4C0)",
        "hero-cell-3": "linear-gradient(135deg, #B8965A, #C8A66A, #D4B880)",
        "hero-cell-4": "linear-gradient(135deg, #A8BFA9, #C0D4C1, #D4E4D5)",
        "why-visual":  "linear-gradient(135deg, #8FAE91, #6B8A6E, #3D5240)",
        "logo-badge":  "linear-gradient(135deg, #2C3B2D, #6B8A6E)",
        "avatar-green":"linear-gradient(135deg, #A8BFA9, #2C3B2D)",
        "avatar-gold": "linear-gradient(135deg, #C4B4A0, #B8965A)",
        "radial-gold": "radial-gradient(circle, rgba(184,150,90,0.07), transparent 60%)",
        "glow-green":  "radial-gradient(circle, rgba(107,138,110,0.1), transparent 60%)",
      },
    },
  },
  plugins: [],
};

export default config;