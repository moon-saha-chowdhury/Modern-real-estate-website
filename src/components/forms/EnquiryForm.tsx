"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { submitEnquiry } from "@/actions/enquiry";
import { Button } from "@/components/common/Button";
import { SampleBadge } from "@/components/common/SampleBadge";
import { DURATION, EASE_MERIDIAN } from "@/lib/animations/eases";
import { ENQUIRY_TOPICS } from "@/lib/constants/enquiry";
import { FIELD_INPUT_CLASS } from "@/lib/constants/ui";
import { cn } from "@/lib/utils/cn";
import {
  enquirySchema,
  type EnquiryInput,
  type EnquiryResult,
  type EnquiryValues,
} from "@/lib/validation/enquiry";
import type { EnquiryFormProps } from "@/types/sections";
import { FormField } from "./FormField";

/**
 * Enquiry form. Validates inline after a field is first left (onTouched), re-validates on the
 * server with the same schema, and reports success, field errors or a send failure.
 */
export function EnquiryForm({ defaultType = "project" }: EnquiryFormProps) {
  const [result, setResult] = useState<EnquiryResult | null>(null);
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    control,
    reset,
    formState: { errors },
  } = useForm<EnquiryInput, unknown, EnquiryValues>({
    resolver: zodResolver(enquirySchema),
    mode: "onTouched",
    defaultValues: { type: defaultType, name: "", email: "", phone: "", message: "", website: "" },
  });

  const selectedType = useWatch({ control, name: "type" });
  const topic = ENQUIRY_TOPICS.find((t) => t.value === selectedType);

  const onSubmit = (values: EnquiryValues) => {
    setResult(null);
    startTransition(async () => {
      try {
        const response = await submitEnquiry(values);
        if (response.status === "invalid") {
          for (const [field, message] of Object.entries(response.errors)) {
            setError(field as keyof EnquiryInput, { message });
          }
          return;
        }
        setResult(response);
        if (response.status === "success") reset();
      } catch {
        setResult({
          status: "error",
          message: "We couldn't reach the server. Check your connection and try again.",
        });
      }
    });
  };

  const describe = (field: keyof EnquiryInput) => (errors[field] ? `${field}-message` : undefined);

  return (
    <AnimatePresence mode="wait" initial={false}>
      {result?.status === "success" ? (
        <motion.div
          key="success"
          role="status"
          className="flex flex-col gap-6 py-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.ui, ease: EASE_MERIDIAN }}
        >
          <span aria-hidden="true" className="h-px w-16 bg-champagne" />
          <p className="font-display text-display-sm">Thank you. Your enquiry has been received.</p>
          {!result.delivered && (
            <p className="max-w-md text-small text-mist">
              This preview site isn&apos;t connected to Meridian&apos;s inbox yet, so your message
              hasn&apos;t been forwarded to the team.
            </p>
          )}
          <Button variant="text" onClick={() => setResult(null)} className="self-start">
            Send another enquiry
          </Button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          aria-labelledby="enquiry-form-title"
          className="flex flex-col gap-9"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.ui, ease: EASE_MERIDIAN }}
        >
          <h3 id="enquiry-form-title" className="sr-only">
            Enquiry form
          </h3>

          <fieldset className="flex flex-col gap-4">
            <legend className="mb-4 label-mono text-mist">I&apos;m enquiring about</legend>
            <div className="grid grid-cols-2 gap-px border border-line bg-line">
              {ENQUIRY_TOPICS.map((option) => (
                <label
                  key={option.value}
                  className={cn(
                    "flex min-h-14 cursor-pointer items-center gap-3 px-4 py-3 text-small transition-colors duration-300",
                    "has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-champagne",
                    selectedType === option.value
                      ? "bg-ivory text-obsidian"
                      : "bg-obsidian text-ivory/80 hover:bg-charcoal hover:text-ivory",
                  )}
                >
                  <input
                    type="radio"
                    value={option.value}
                    className="sr-only"
                    {...register("type")}
                  />
                  {option.label}
                </label>
              ))}
            </div>
            {topic && <p className="text-small text-mist">{topic.description}</p>}
          </fieldset>

          <div className="grid gap-9 md:grid-cols-2">
            <FormField id="name" label="Full name" error={errors.name?.message}>
              <input
                id="name"
                type="text"
                autoComplete="name"
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={describe("name")}
                className={FIELD_INPUT_CLASS}
                {...register("name")}
              />
            </FormField>
            <FormField id="email" label="Email" error={errors.email?.message}>
              <input
                id="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={describe("email")}
                className={FIELD_INPUT_CLASS}
                {...register("email")}
              />
            </FormField>
          </div>

          <FormField id="phone" label="Phone" optional error={errors.phone?.message}>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={describe("phone")}
              className={FIELD_INPUT_CLASS}
              {...register("phone")}
            />
          </FormField>

          <FormField id="message" label="Message" error={errors.message?.message}>
            <textarea
              id="message"
              rows={4}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={describe("message")}
              className={cn(FIELD_INPUT_CLASS, "resize-y")}
              {...register("message")}
            />
          </FormField>

          {/* Honeypot: hidden from people and assistive tech */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register("website")}
            />
          </div>

          {result?.status === "error" && (
            <p role="alert" className="border-l-2 border-danger pl-4 text-small text-danger">
              {result.message}
            </p>
          )}

          <div className="flex flex-col-reverse items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <SampleBadge label="Inbox not yet connected" className="text-mist" />
            <Button type="submit" icon disabled={pending} aria-busy={pending}>
              {pending ? "Sending…" : "Send enquiry"}
            </Button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
