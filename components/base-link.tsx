import { AnchorHTMLAttributes, ReactNode } from 'react';

interface BaseLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  href: string;
}

export default function BaseLink({ children, href, className = '', ...props }: BaseLinkProps) {
  return (
    <a
      className={`text-neutral-700 hover:text-neutral-950 transition-colors border-b-2 border-neutral-300 hover:border-neutral-500 active:border-b-neutral-950 ${className}`}
      href={href}
      {...props}
    >
      {children}
    </a>
  );
}

