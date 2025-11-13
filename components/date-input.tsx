import { cn } from "@/lib/utils"

interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function DateInput({ label, className, ...props }: DateInputProps) {
  return (
    <div className="flex items-center gap-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <input
        type="date"
        className={cn(
          "px-2 py-1 rounded text-sm",
          "focus:outline-none focus:ring-1 focus:ring-ring",
          className,
        )}
        {...props}
      />
    </div>
  )
}
