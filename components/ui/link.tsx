// Link.tsx
import Link from 'next/link';

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const StyledLink: React.FC<LinkProps> = ({ href, children, className }) => {
  // Default classes for the link
  const defaultClasses = "font-medium text-primary underline underline-offset-4";

  return (
    <Link href={href} className={`${defaultClasses} ${className}`}>
      {children}
    </Link>
  );
};

export default StyledLink;
