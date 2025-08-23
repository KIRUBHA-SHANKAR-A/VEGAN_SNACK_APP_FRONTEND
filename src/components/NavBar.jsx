import React, { useState, useEffect, useRef } from "react";
import { Menu, X, User, Leaf, LogOut, Settings, User as UserIcon, UserPlus, Plus, Package, Shield, CheckCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function NavBar({ onLogout = () => {}, authUpdateTrigger }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const profileDropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check authentication status
  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    const role = localStorage.getItem("role");
    
    setIsAuthenticated(!!token);
    setUserEmail(email || "");
    setUserRole(role || "");
  };

  useEffect(() => {
    checkAuthStatus();
  }, [location.pathname, authUpdateTrigger]);

  useEffect(() => {
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const handleAuthChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Define nav links based on user role
  const getNavLinks = () => {
    const baseLinks = [
      { href: "/", label: "Home", icon: null },
      { href: "/snacks", label: "Snacks", icon: null },
    ];

    if (userRole === "VENDOR") {
      return [
        // ...baseLinks,
        { href: "/add-snack", label: "Add Snack", icon: <Plus size={16} className="mr-1" /> },
        { href: "/inventory", label: "Inventory", icon: <Package size={16} className="mr-1" /> },
      ];
    }

    if (userRole === "PRODUCT_MANAGER") {
      return [
        // ...baseLinks,
        { href: "/approve-vendors", label: "Approve Vendors", icon: <CheckCircle size={16} className="mr-1" /> },
        { href: "/approve-snacks", label: "Approve Snacks", icon: <CheckCircle size={16} className="mr-1" /> },
      ];
    }

    if (userRole === "ADMIN") {
      return [
        // ...baseLinks,
        { href: "/approve-vendors", label: "Approve Vendors", icon: <CheckCircle size={16} className="mr-1" /> },
        { href: "/approve-snacks", label: "Approve Snacks", icon: <CheckCircle size={16} className="mr-1" /> },
        { href: "/create-product-manager", label: "Create PM", icon: <UserPlus size={16} className="mr-1" /> }, 
        // { href: "/admin", label: "Admin", icon: <Shield size={16} className="mr-1" /> },
      ];
    }

    return baseLinks;
  };

  const navLinks = getNavLinks();

  const handleLogoutClick = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('vendorId');
    
    setIsAuthenticated(false);
    setUserEmail("");
    setUserRole("");
    setIsProfileDropdownOpen(false);
    
    // Dispatch event to update other components
    window.dispatchEvent(new Event('authChange'));
    onLogout();
    navigate("/");
  };

  const handleNavigation = (path) => {
    if (path === "/snacks" && !isAuthenticated) {
      navigate("/auth"); // redirect to login
      return;
    }
    navigate(path);
  };

  // Get background color based on role
  const getNavbarBg = () => {
    if (userRole === "ADMIN" || userRole === "PRODUCT_MANAGER") {
      return isScrolled 
        ? 'bg-blue-900/95 backdrop-blur-md shadow-2xl' 
        : 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 shadow-lg';
    }
    
    return isScrolled 
      ? 'bg-green-900/95 backdrop-blur-md shadow-2xl' 
      : 'bg-gradient-to-r from-green-600 via-green-700 to-green-800 shadow-lg';
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${getNavbarBg()} ${
      isScrolled ? 'h-16' : 'h-20'
    } text-white flex items-center`}>
      <div className="container mx-auto px-6 flex items-center justify-between w-full">
        
        {/* Left: Logo + App Name */}
        <div 
          className="flex items-center space-x-3 group cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="bg-white text-green-600 font-bold rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 shadow-lg">
            <Leaf size={20} className="text-green-600" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
            VeeGo
          </span>
        </div>

        {/* Center: Nav Links (Desktop) */}
        <div className="hidden md:flex space-x-1 text-lg font-medium">
          {navLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(link.href)}
              className="flex items-center px-4 py-2 rounded-lg transition-all duration-300 hover:text-yellow-200 hover:bg-white/10 hover:scale-105 hover:shadow-lg group relative"
            >
              {link.icon}
              <span className="relative z-10">{link.label}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-green-300/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-yellow-200 transition-all duration-300 group-hover:w-full group-hover:left-0"></div>
            </button>
          ))}
        </div>

        {/* Right: User Profile or Login Button */}
        <div className="hidden md:flex items-center space-x-2">
          {isAuthenticated ? (
            <div className="relative" ref={profileDropdownRef}>
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-2 bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                  {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-sm hidden lg:block">{userEmail || 'User'}</span>
              </button>
              
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-800 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium truncate">{userEmail || 'User'}</p>
                    <p className="text-xs text-gray-500">
                      {userRole || 'User'}
                    </p>
                  </div>
                  <button
                    onClick={handleLogoutClick}
                    className="flex items-center w-full px-4 py-2 text-sm hover:bg-green-50 transition-colors duration-200"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              {/* Admin Login Button */}
              <button
                onClick={() => navigate("/staff-login")}
                className="bg-white text-green-600 font-medium py-2 px-4 rounded-full hover:bg-green-50 transition-all duration-300 hover:shadow-lg flex items-center space-x-1"
         >
                <Shield size={18} />
                <span>Admin Login</span>
              </button>
              
              {/* Regular Login Button */}
              <button
                onClick={() => navigate("/auth")}
                className="bg-white text-green-600 font-medium py-2 px-4 rounded-full hover:bg-green-50 transition-all duration-300 hover:shadow-lg flex items-center space-x-1"
              >
                <User size={18} />
                <span>Login/SignUp</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
        >
          <div className="relative w-6 h-6">
            <Menu 
              size={24} 
              className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'}`}
            />
            <X 
              size={24} 
              className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'rotate-0 opacity-100' : 'rotate-180 opacity-0'}`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div className={`absolute top-full left-0 w-full bg-green-800/95 backdrop-blur-md transition-all duration-500 md:hidden ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden`}>
        <div className="px-6 py-4 space-y-1">
          {navLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => {
                handleNavigation(link.href);
                setIsOpen(false);
              }}
              className="flex items-center w-full text-left px-4 py-3 rounded-lg hover:text-yellow-200 hover:bg-white/10 transition-all duration-300 transform hover:translate-x-2"
            >
              {link.icon}
              <span>{link.label}</span>
            </button>
          ))}
          
          {isAuthenticated ? (
            <>
              <div className="pt-4 border-t border-green-600/30">
                <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-white/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                    {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium">{userEmail || 'User'}</p>
                    <p className="text-xs text-green-200 opacity-80">
                      {userRole || 'User'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogoutClick();
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full text-left px-4 py-3 rounded-lg hover:text-yellow-200 hover:bg-white/10 transition-all duration-300"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <div className="pt-4 border-t border-green-600/30">
              <button
                onClick={() => {
                  navigate("/auth");
                  setIsOpen(false);
                }}
                className="flex items-center space-x-3 w-full text-left px-4 py-3 rounded-lg bg-white text-green-600 font-medium justify-center hover:bg-green-50 transition-all duration-300"
              >
                <User size={20} />
                <span>Login/SignUp</span>
              </button>
              <button
                onClick={() => {
                  navigate("/staff-login");
                  setIsOpen(false);
                }}
                className="flex items-center space-x-3 w-full text-left px-4 py-3 rounded-lg bg-blue-600 text-white font-medium justify-center hover:bg-blue-700 transition-all duration-300 mt-2"
              >
                <Shield size={20} />
                <span>Admin Login</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}