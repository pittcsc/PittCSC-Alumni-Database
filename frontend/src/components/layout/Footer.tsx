import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-pitt text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-300">
          <div className="flex items-center">
            © {currentYear}, Built with
            <Heart className="h-4 w-4 mx-1 text-red-500 fill-current" />
            by{' '}
            <a
              href="https://pittcsc.org"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 font-medium text-white hover:text-pittGold transition-colors"
            >
              PittCSC
            </a>
            .
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link to="/about" className="hover:text-pittGold transition-colors">
              About
            </Link>
            <a href="mailto:pittcsc@gmail.com" className="hover:text-pittGold transition-colors">
              Contact
            </a>
            <a
              href="https://pittcs.wiki/sitemap"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pittGold transition-colors"
            >
              Sitemap
            </a>
            <a
              href="https://pittcs.wiki/feedback"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pittGold transition-colors"
            >
              Feedback
            </a>
            <a
              href="https://github.com/pittcsc/PittCSC-Alumni-Database"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pittGold transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
