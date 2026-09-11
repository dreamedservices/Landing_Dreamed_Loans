import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  hint?: string;
};

const fieldClasses =
  "h-11 w-full appearance-none rounded-md border border-line-light bg-brand-white px-3.5 pr-10 text-body text-brand-ink " +
  "transition-colors duration-150 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue " +
  "disabled:opacity-50 aria-invalid:border-red-600";

export function Select({
  id,
  label,
  options,
  placeholder,
  error,
  hint,
  className,
  required,
  ...rest
}: SelectProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-small font-medium text-brand-ink">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      <div className="relative">
        <select
          id={id}
          required={required}
          defaultValue={rest.defaultValue ?? ""}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={cn(hintId, errorId) || undefined}
          className={cn(fieldClasses, className)}
          {...rest}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-ink/50"
        />
      </div>
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
