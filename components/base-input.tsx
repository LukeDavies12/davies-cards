import { InputHTMLAttributes } from 'react';

interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> { }

export default function BaseInput({ className = '', ...props }: BaseInputProps) {
  return (
    <input
      className={`w-full px-2 py-1 text-base bg-neutral-100 rounded-md hover:bg-neutral-200 focus:bg-neutral-300 focus:outline-none transition-colors ease-linear duration-100 border border-transparent ${className}`}
      {...props}
    />
  );
}
