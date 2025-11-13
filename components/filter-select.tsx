import { cn } from "@/lib/utils";

interface FilterSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: Array<{ value: string | number; label: string }>
}

export function FilterSelect({ label, className, options, ...props }: FilterSelectProps) {
  return (
    <div className="flex items-center gap-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <select
        className={cn(
          "px-2 py-1 rounded text-sm",
          "focus:outline-none focus:ring-1 focus:ring-ring",
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}