import type { ReactNode } from "react";

export const inputClass =
  "w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-base leading-6 text-stone-950";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-stone-800">{label}</span>
      {hint ? <span className="mt-0.5 block text-sm leading-5 text-stone-600">{hint}</span> : null}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export function TextArea({
  value,
  onChange,
  rows = 3,
}: {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <textarea
      className={inputClass}
      rows={rows}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export function TextInput({
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "url";
  placeholder?: string;
}) {
  return (
    <input
      className={inputClass}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
