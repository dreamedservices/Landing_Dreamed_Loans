import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  id: string;
  /** Acepta nodos para poder incrustar un enlace (ej. a Privacidad) dentro del texto del consentimiento. */
  label: ReactNode;
  error?: string;
};

export function Checkbox({ id, label, error, className, required, ...rest }: CheckboxProps) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-start gap-2.5">
        <input
          id={id}
          type="checkbox"
          required={required}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={errorId}
          className={cn(
            "mt-0.5 h-4 w-4 shrink-0 rounded-sm border border-line-light text-brand-blue " +
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue",
            className,
          )}
          {...rest}
        />
        <label htmlFor={id} className="text-small text-brand-ink">
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </label>
      </div>
      {error ? (
        <p id={errorId} className="text-small text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
