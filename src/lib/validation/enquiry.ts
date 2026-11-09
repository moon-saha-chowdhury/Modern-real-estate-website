import { z } from "zod";
import { ENQUIRY_MESSAGE_MAX } from "@/lib/constants/enquiry";

/**
 * Enquiry form schema, shared by the client form (react-hook-form) and the server action,
 * so the same rules run in both places.
 */
export const enquirySchema = z.object({
  type: z.enum(["project", "visit", "landowner", "general"], {
    error: "Choose what your enquiry is about.",
  }),
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(120, "Please keep your name under 120 characters."),
  email: z.email("Enter an email address like name@example.com.").trim(),
  phone: z
    .string()
    .trim()
    .max(30, "That phone number looks too long.")
    .regex(/^[+\d\s()-]*$/, "Use digits, spaces and + ( ) - only.")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more (at least 10 characters).")
    .max(ENQUIRY_MESSAGE_MAX, `Please keep your message under ${ENQUIRY_MESSAGE_MAX} characters.`),
  /** Honeypot: real visitors never see or fill this field. */
  website: z.string().max(0).optional().or(z.literal("")),
});

export type EnquiryInput = z.input<typeof enquirySchema>;
export type EnquiryValues = z.output<typeof enquirySchema>;

export type EnquiryFieldErrors = Partial<Record<keyof EnquiryValues, string>>;

export type EnquiryResult =
  | { status: "success"; delivered: boolean }
  | { status: "invalid"; errors: EnquiryFieldErrors }
  | { status: "error"; message: string };
