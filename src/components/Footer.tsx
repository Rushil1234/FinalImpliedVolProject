
import React from 'react';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={cn("w-full py-6 px-8 border-t bg-primary text-primary-foreground", className)}>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-primary-foreground/80">
            © {new Date().getFullYear()} Nittany Lion Fund. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
