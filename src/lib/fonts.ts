import { IBM_Plex_Mono, Instrument_Serif, Manrope } from "next/font/google";

/** Display — oversized editorial headlines and italic emphasis. */
export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

/** Body — refined, open sans-serif (variable font). */
export const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

/** Technical labels — annotations, metadata, CTAs. */
export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const fontVariables = [instrumentSerif.variable, manrope.variable, plexMono.variable].join(
  " ",
);
