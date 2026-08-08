import React from 'react';
import { Link } from 'react-router-dom';
import { Fish, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen pt-28 pb-20 flex items-center justify-center px-4 text-center">
      <div className="glass-card rounded-3xl p-8 sm:p-12 max-w-md w-full space-y-6 shadow-2xl border border-border/60">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto text-primary animate-float">
          <Fish className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold hydro-text">404</h1>
          <h2 className="text-xl font-bold text-foreground">Page Not Found</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The page you are looking for doesn't exist or has been moved to another hatchery section.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-lg"
        >
          <Home className="w-4 h-4" />
          <span>Return to Home</span>
        </Link>
      </div>
    </div>
  );
};
