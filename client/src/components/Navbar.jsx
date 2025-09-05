import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  User, 
  LogOut, 
  Brain, 
  Trophy, 
  History, 
  Plus,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Brain },
    { path: '/create-quiz', label: 'Create Quiz', icon: Plus },
    { path: '/history', label: 'History', icon: History },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="navbar bg-base-100 shadow-lg border-b border-base-300 sticky top-0 z-50 backdrop-blur-md bg-opacity-90"
    >
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost text-xl font-bold text-primary">
          <Brain className="w-6 h-6 mr-2" />
          AI Quizzer
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="navbar-center hidden lg:flex">
        {isAuthenticated && (
          <ul className="menu menu-horizontal px-1 space-x-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`btn btn-ghost btn-sm ${
                    isActive(path) ? 'bg-primary text-primary-content' : ''
                  }`}
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="navbar-end space-x-2">
        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="btn btn-ghost btn-circle"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </motion.button>

        {isAuthenticated ? (
          <>
            {/* Desktop User Menu */}
            <div className="dropdown dropdown-end hidden lg:block">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-8 rounded-full bg-primary text-primary-content flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-box w-52 border border-base-300">
                <li className="menu-title">
                  <span className="text-primary font-semibold">{user?.username}</span>
                </li>
                <li>
                  <Link to="/profile" className="justify-between">
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </span>
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="text-error">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="btn btn-ghost btn-circle"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="space-x-2">
            <Link to="/login" className="btn btn-ghost btn-sm">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isAuthenticated && isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-0 right-0 bg-base-100 border-b border-base-300 lg:hidden shadow-lg"
        >
          <div className="p-4 space-y-2">
            <div className="flex items-center space-x-3 p-3 bg-base-200 rounded-lg mb-4">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-primary">{user?.username}</p>
                <p className="text-sm text-base-content/70">{user?.email}</p>
              </div>
            </div>
            
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive(path) 
                    ? 'bg-primary text-primary-content' 
                    : 'hover:bg-base-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            ))}
            
            <div className="border-t border-base-300 pt-2 mt-4">
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-base-200"
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-base-200 text-error w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;