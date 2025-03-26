
import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn("w-full py-6 px-8 bg-primary text-primary-foreground", className)}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-accent animate-pulse-subtle"></div>
          <h1 className="font-semibold text-xl">Nittany Lion Fund</h1>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="text-white hover:text-secondary transition-colors">Home</Link>
          <Link to="/details" className="text-white hover:text-secondary transition-colors">Details</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
