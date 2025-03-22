import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-3 glass shadow-md'
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            TourGenius
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`font-medium hover:text-primary transition-colors ${
              isScrolled ? 'text-black' : ''
            }`}
          >
            Home
          </Link>
          <Link 
            to="/#features" 
            className={`font-medium hover:text-primary transition-colors ${
              isScrolled ? 'text-black' : ''
            }`}
          >
            Features
          </Link>
          <Link 
            to="/#testimonials" 
            className={`font-medium hover:text-primary transition-colors ${
              isScrolled ? 'text-black' : ''
            }`}
          >
            Testimonials
          </Link>
          <Link 
            to="/#pricing" 
            className={`font-medium hover:text-primary transition-colors ${
              isScrolled ? 'text-black' : ''
            }`}
          >
            Pricing
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Link to="/auth">
            <Button variant="outline">Log In</Button>
          </Link>
          <Link to="/auth?signup=true">
            <Button>Sign Up</Button>
          </Link>
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass py-4 px-6 animate-fade-in">
          <nav className="flex flex-col space-y-4">
            <Link
              to="/"
              className={`font-medium hover:text-primary transition-colors ${
                isScrolled ? 'text-black' : ''
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/#features"
              className={`font-medium hover:text-primary transition-colors ${
                isScrolled ? 'text-black' : ''
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to="/#testimonials"
              className={`font-medium hover:text-primary transition-colors ${
                isScrolled ? 'text-black' : ''
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Testimonials
            </Link>
            <Link
              to="/#pricing"
              className={`font-medium hover:text-primary transition-colors ${
                isScrolled ? 'text-black' : ''
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <div className="pt-4 flex flex-col space-y-3">
              <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Log In
                </Button>
              </Link>
              <Link to="/auth?signup=true" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;