import type { FormFieldProps } from "@/types/sections";

/**
 * Label + control + hint/error, wired for screen readers.
 * The control itself (passed as children) must use `${id}` and reference `${id}-message`.
 */
export function FormField({ id, label, error, hint, optional, children }: FormFieldProps) {
  const message = error ?? hint;
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="flex items-baseline justify-between gap-4 label-mono text-mist"
      >
        <span>{label}</span>
        {optional && <span className="tracking-normal text-ivory/40 normal-case">Optional</span>}
      </label>
      {children}
      {message && (
        <p
          id={`${id}-message`}
          role={error ? "alert" : undefined}
          className={error ? "pt-1 text-small text-danger" : "pt-1 text-small text-mist"}
        >
          {message}
        </p>
      )}
    </div>
  );
}
