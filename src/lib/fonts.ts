import { Google_Sans_Flex, IBM_Plex_Mono, Manrope } from "next/font/google";

/**
 * Display: Google Sans Flex (variable).
 * - opsz: optical sizing tunes letterforms for very large headlines automatically
 * - slnt: the family has no italic, so editorial emphasis uses a -10° slant instead
 */
export const googleSansFlex = Google_Sans_Flex({
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz", "slnt"],
  variable: "--font-google-sans-flex",
  // next/font has no metric data for this family yet, so no size-adjusted fallback can be generated.
  // The font is preloaded; measure CLS in M8.
  adjustFontFallback: false,
  display: "swap",
});

/** Body: refined, open sans-serif (variable font). */
export const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

/** Technical labels: annotations, metadata, CTAs. */
export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const fontVariables = [googleSansFlex.variable, manrope.variable, plexMono.variable].join(
  " ",
);
