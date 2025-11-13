import { cn } from '@/lib/utils'

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  value?: number | ''
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  name?: string
}

export function NumberInput({ label, className, onChange, value, name, ...props }: NumberInputProps) {
  return (
    <div className="flex flex-col items-start gap-1">
      {label && (
        <label className="text-sm font-medium text-neutral-900" htmlFor={name}>
          {label}
        </label>
      )}
      <input
        type="number"
        id={name}
        value={value ?? ''}
        onChange={onChange}
        className={cn(
          "px-2 py-1 rounded text-sm bg-neutral-50 hover:bg-neutral-100",
          "focus:outline-none focus:bg-neutral-200",
          className
        )}
        {...props}
      />
    </div>
  )
}
