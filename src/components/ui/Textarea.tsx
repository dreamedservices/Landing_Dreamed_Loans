import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
};

const fieldClasses =
  "w-full min-h-28 rounded-md border border-line-light bg-brand-white px-3.5 py-2.5 text-body text-brand-ink " +
  "placeholder:text-brand-ink/40 transition-colors duration-150 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue " +
  "disabled:opacity-50 aria-invalid:border-red-600";

export function Textarea({ id, label, error, hint, className, required, ...rest }: TextareaProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-small font-medium text-brand-ink">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      <textarea
        id={id}
        required={required}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={cn(hintId, errorId) || undefined}
        className={cn(fieldClasses, className)}
        {...rest}
      />
      {hint ? (
        <p id={hintId} className="text-small text-brand-ink/70">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-small text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
