"use server";

import {
  enquirySchema,
  type EnquiryFieldErrors,
  type EnquiryInput,
  type EnquiryResult,
} from "@/lib/validation/enquiry";

/**
 * Receives an enquiry from any Meridian form.
 *
 * Delivery is not connected yet: Meridian still has to confirm the destination inbox and an
 * email provider (docs/ASSETS.md → Operations). Until then, valid enquiries are logged on the
 * server and the response reports `delivered: false` so the UI can say so honestly.
 */
export async function submitEnquiry(input: EnquiryInput): Promise<EnquiryResult> {
  const parsed = enquirySchema.safeParse(input);

  if (!parsed.success) {
    const errors: EnquiryFieldErrors = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof EnquiryFieldErrors | undefined;
      if (field && !errors[field]) errors[field] = issue.message;
    }
    return { status: "invalid", errors };
  }

  // Honeypot filled: pretend success, deliver nothing.
  if (parsed.data.website) return { status: "success", delivered: false };

  try {
    // TODO(M7): send via the chosen provider once ENQUIRY_TO_EMAIL and the provider key exist.
    console.info("[enquiry] received (delivery not configured)", {
      type: parsed.data.type,
      at: new Date().toISOString(),
    });
    return { status: "success", delivered: false };
  } catch {
    return {
      status: "error",
      message: "We couldn't send your enquiry just now. Please try again in a moment.",
    };
  }
}
