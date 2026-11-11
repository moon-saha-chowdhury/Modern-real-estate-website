import type { LegalSection } from "@/types/content";

/**
 * ⚠ SAMPLE TEXT for the demo site. These are plain, generic paragraphs written to fill the pages;
 * they are not legal advice. Replace both documents with text reviewed by the company's lawyer.
 */
export const privacySections: LegalSection[] = [
  {
    heading: "Who we are",
    body: [
      'Meridian Developments ("Meridian", "we") is a property developer. This page explains what we do with the personal information you give us through this website.',
    ],
  },
  {
    heading: "What we collect",
    body: [
      "When you send an enquiry we collect your name, email address, an optional phone number and your message, and the topic you chose. We do not ask for anything else.",
      "Like most websites, our servers record basic technical information about each visit, such as the page requested and the time. We do not use it to identify you.",
    ],
  },
  {
    heading: "How we use it",
    body: [
      "We use your details only to reply to your enquiry and to follow up on it. We do not sell your information and we do not send marketing email unless you ask us to.",
    ],
  },
  {
    heading: "Who sees it",
    body: [
      "Your enquiry is read by our sales and project teams. We share it with a contractor or consultant only when that is needed to answer you, and only under a duty of confidentiality.",
    ],
  },
  {
    heading: "How long we keep it",
    body: [
      "We keep enquiries for as long as they are needed to deal with them, and for a reasonable period afterwards in case you come back to us. You can ask us to delete yours at any time.",
    ],
  },
  {
    heading: "Your rights",
    body: [
      "You can ask to see what we hold about you, to correct it or to have it deleted. Send a short email to the address on our contact page and we will reply.",
    ],
  },
  {
    heading: "Cookies",
    body: [
      "This site does not use advertising or tracking cookies. If that changes, we will say so here and ask first.",
    ],
  },
  {
    heading: "Changes to this page",
    body: ["If we change how we handle personal information we will update this page."],
  },
];

export const termsSections: LegalSection[] = [
  {
    heading: "Using this website",
    body: [
      "This website describes Meridian Developments and our projects. You are welcome to browse it, and to share links to it, as long as you do so lawfully.",
    ],
  },
  {
    heading: "Our projects and what we show",
    body: [
      "Images, plans and descriptions of projects are indicative. Renders and 360° tours show the intended design and may differ from the finished building. Floor areas and finishes are confirmed in the sale documents, not on this website.",
    ],
  },
  {
    heading: "Enquiries",
    body: [
      "Sending an enquiry does not create a contract or a reservation. Availability and prices are confirmed in writing by our sales team.",
    ],
  },
  {
    heading: "Our content",
    body: [
      "The text, drawings, renders and photographs on this website belong to Meridian or to the people who made them. Please ask before you copy them for any other purpose.",
    ],
  },
  {
    heading: "Links to other websites",
    body: [
      "We may link to other websites. We do not control them and are not responsible for what they say or do.",
    ],
  },
  {
    heading: "Liability",
    body: [
      "We take care to keep this website accurate, but we cannot promise it is always complete or free of mistakes. To the extent the law allows, we are not liable for loss that comes from relying on it.",
    ],
  },
  {
    heading: "Changes",
    body: [
      "We may change these terms from time to time. The version on this page is the current one.",
    ],
  },
];
