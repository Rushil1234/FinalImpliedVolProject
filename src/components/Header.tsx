
import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn("w-full py-6 px-8", className)}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary animate-pulse-subtle"></div>
          <h1 className="font-semibold text-xl">Nittany Lion Fund</h1>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#" className="link-hover">Dashboard</a>
          <a href="#" className="link-hover">Analytics</a>
          <a href="#" className="link-hover">Reports</a>
          <a href="#" className="link-hover">Settings</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
