import { ButtonHTMLAttributes, ReactNode } from 'react';

interface BrandButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function BrandButton({ children, className = '', ...props }: BrandButtonProps) {
  return (
    <button
      className={`bg-red-700 text-white rounded-lg px-5 py-1.5 hover:bg-red-800 active:bg-red-900 transition-colors cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

