import { TextareaHTMLAttributes } from 'react';

interface BaseTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> { }

export default function BaseTextarea({ className = '', ...props }: BaseTextareaProps) {
  return (
    <textarea
      className={`w-full px-2 py-1 text-base bg-neutral-100 rounded-md hover:bg-neutral-200 focus:bg-neutral-300 focus:outline-none transition-colors ease-linear duration-100 resize-none border border-transparent ${className}`}
      {...props}
    />
  );
}
