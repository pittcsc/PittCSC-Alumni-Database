import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Menu, 
  X, 
  Briefcase, 
  Users, 
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  
  const isLoggedIn = isAuthenticated;
  const isAdmin = user?.is_superuser;


  const handleSignOut = async () => {
    await logout();
    navigate('/');
    setIsProfileDropdownOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 z-50 w-full transition-all duration-300 bg-gradient-pitt shadow-medium">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="relative">
                <GraduationCap className="h-9 w-9 text-pittGold transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-pittGold/20 rounded-full blur-xl group-hover:bg-pittGold/30 transition-colors"></div>
              </div>
              <div className="ml-3">
                <span className="text-xl font-bold font-display text-white">PittCSC</span>
                <span className="text-xs block -mt-1 text-pittGold font-medium">Alumni Network</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {isLoggedIn ? (
              <>
                <NavLink to="/alumni" icon={<Users className="h-4 w-4" />} active={isActive('/alumni')}>
                  Alumni
                </NavLink>
                <NavLink to="/company-processes" icon={<Briefcase className="h-4 w-4" />} active={isActive('/company-processes')}>
                  Interview Prep
                </NavLink>
                <NavLink to="/connections" active={isActive('/connections')}>
                  Connections
                </NavLink>
                
                {isAdmin && (
                  <NavLink to="/admin" active={isActive('/admin')}>
                    Admin
                  </NavLink>
                )}
                
                {/* Profile Dropdown */}
                <div className="relative ml-4">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center px-3 py-2 rounded-lg hover:bg-white/10 transition-colors group"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-gold flex items-center justify-center text-pittDarkNavy font-semibold">
                      {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <ChevronDown className={`ml-2 h-4 w-4 text-pittGold transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-large py-2 animate-slide-down">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-pittDarkNavy">{user?.full_name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-pittGold/10 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        My Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <NavLink to="/about" active={isActive('/about')}>
                  About
                </NavLink>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-lg bg-gradient-gold text-pittDarkNavy font-semibold hover:shadow-glow-gold transition-all transform hover:scale-105"
                >
                  Join Network
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
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
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-pittDarkNavy/95 backdrop-blur-md border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isLoggedIn ? (
              <>
                <MobileNavLink to="/alumni" icon={<Users className="h-4 w-4" />} onClick={() => setIsMenuOpen(false)}>
                  Alumni Directory
                </MobileNavLink>
                <MobileNavLink to="/company-processes" icon={<Briefcase className="h-4 w-4" />} onClick={() => setIsMenuOpen(false)}>
                  Interview Prep
                </MobileNavLink>
                <MobileNavLink to="/connections" onClick={() => setIsMenuOpen(false)}>
                  My Connections
                </MobileNavLink>
                {isAdmin && (
                  <MobileNavLink to="/admin" onClick={() => setIsMenuOpen(false)}>
                    Admin Panel
                  </MobileNavLink>
                )}
                
                <div className="border-t border-white/10 mt-2 pt-2">
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold text-white">{user?.full_name}</p>
                    <p className="text-xs text-pittGold">{user?.email}</p>
                  </div>
                  <MobileNavLink to="/profile" icon={<User className="h-4 w-4" />} onClick={() => setIsMenuOpen(false)}>
                    My Profile
                  </MobileNavLink>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center px-3 py-2 text-white hover:bg-white/10 transition-colors rounded-lg"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <MobileNavLink to="/about" onClick={() => setIsMenuOpen(false)}>
                  About
                </MobileNavLink>
                <MobileNavLink to="/login" onClick={() => setIsMenuOpen(false)}>
                  Login
                </MobileNavLink>
                <Link
                  to="/register"
                  className="block mx-2 px-4 py-2 rounded-lg bg-gradient-gold text-center text-pittDarkNavy font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Join Network
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// Desktop Navigation Link Component
const NavLink: React.FC<{
  to: string;
  icon?: React.ReactNode;
  active?: boolean;
  children: React.ReactNode;
}> = ({ to, icon, active, children }) => (
  <Link
    to={to}
    className={`flex items-center px-3 py-2 rounded-lg transition-all ${
      active 
        ? 'bg-white/15 text-pittGold font-medium' 
        : 'text-white hover:bg-white/10 hover:text-pittGold'
    }`}
  >
    {icon && <span className="mr-2">{icon}</span>}
    {children}
  </Link>
);

// Mobile Navigation Link Component
const MobileNavLink: React.FC<{
  to: string;
  icon?: React.ReactNode;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ to, icon, onClick, children }) => (
  <Link
    to={to}
    className="flex items-center px-3 py-2 text-white hover:bg-white/10 transition-colors rounded-lg"
    onClick={onClick}
  >
    {icon && <span className="mr-3">{icon}</span>}
    {children}
  </Link>
);

export default Navbar;