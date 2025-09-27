import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X, Briefcase } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  
  const isLoggedIn = isAuthenticated;
  const isAdmin = user?.is_superuser;

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-pittDeepNavy text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <GraduationCap className="h-8 w-8 text-pittGold" />
              <span className="ml-2 text-xl font-bold">PittCSC Alumni</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link to="/alumni" className="px-3 py-2 rounded-md hover:bg-pittNavy transition-colors">
                  Browse Alumni
                </Link>
                <Link to="/company-processes" className="px-3 py-2 rounded-md hover:bg-pittNavy transition-colors">
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-1" />
                    <span>Interview Processes</span>
                  </div>
                </Link>
                <Link to="/events" className="px-3 py-2 rounded-md hover:bg-pittNavy transition-colors">
                  Events
                </Link>
                <Link to="/connections" className="px-3 py-2 rounded-md hover:bg-pittNavy transition-colors">
                  My Connections
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="px-3 py-2 rounded-md hover:bg-pittNavy transition-colors">
                    Admin
                  </Link>
                )}
                <Link to="/profile" className="px-3 py-2 rounded-md hover:bg-pittNavy transition-colors">
                  My Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-2 rounded-md bg-pittNavy hover:bg-opacity-80 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/about" className="px-3 py-2 rounded-md hover:bg-pittNavy transition-colors">
                  About
                </Link>
                <Link to="/login" className="px-3 py-2 rounded-md hover:bg-pittNavy transition-colors">
                  Login
                </Link>
                <Link to="/mock-login" className="px-3 py-2 rounded-md hover:bg-pittNavy transition-colors">
                  Mock Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 rounded-md bg-pittGold text-pittDeepNavy hover:bg-opacity-90 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-pittNavy focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-pittDeepNavy">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isLoggedIn ? (
              <>
                <Link
                  to="/alumni"
                  className="block px-3 py-2 rounded-md hover:bg-pittNavy transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Browse Alumni
                </Link>
                <Link
                  to="/company-processes"
                  className="block px-3 py-2 rounded-md hover:bg-pittNavy transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-1" />
                    <span>Interview Processes</span>
                  </div>
                </Link>
                <Link
                  to="/events"
                  className="block px-3 py-2 rounded-md hover:bg-pittNavy transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Events
                </Link>
                <Link
                  to="/connections"
                  className="block px-3 py-2 rounded-md hover:bg-pittNavy transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Connections
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-md hover:bg-pittNavy transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md hover:bg-pittNavy transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md bg-pittNavy hover:bg-opacity-80 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/about"
                  className="block px-3 py-2 rounded-md hover:bg-pittNavy transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md hover:bg-pittNavy transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/mock-login"
                  className="block px-3 py-2 rounded-md hover:bg-pittNavy transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mock Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md bg-pittGold text-pittDeepNavy hover:bg-opacity-90 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;