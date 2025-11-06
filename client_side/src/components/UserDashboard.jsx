import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FiHeart, FiShoppingCart, FiUser, FiPhone, FiChevronDown, FiSearch, FiMenu, FiX } from 'react-icons/fi';

const NAV_LINKS = [
  { label: 'Favorites', icon: FiHeart },
  { label: 'Cart', icon: FiShoppingCart },
  { label: 'Contacts', icon: FiPhone },
  { label: 'Profile', icon: FiUser },
];

const CATEGORIES = [
  {
    label: 'Gold',
    items: ['Rings', 'Necklaces', 'Bangles', 'Chains', 'Bracelets', 'Pendants', 'Earrings', 'Coins'],
  },
  {
    label: 'Diamond',
    items: ['Rings', 'Earrings', 'Pendants', 'Necklaces', 'Bracelets', 'Bangles'],
  },
  {
    label: 'Platinum',
    items: ['Bands', 'Chains', 'Bracelets', 'Rings', 'Necklaces'],
  },
  {
    label: 'Silver',
    items: ['Coins', 'Chains', 'Bracelets', 'Rings', 'Necklaces'],
  },
];

const TopBar = () => {
  const [openProfile, setOpenProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openProfile && !e.target.closest('.profile-dropdown')) {
        setOpenProfile(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openProfile]);

  return (
    <div className="w-full bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                JM
              </div>
              <span className="hidden sm:block font-bold text-xl text-gray-900">Jewellery Mart</span>
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for jewellery..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {NAV_LINKS.filter(n => n.label !== 'Profile').map(n => {
              const Icon = n.icon;
              return (
                <button
                  key={n.label}
                  className="relative flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{n.label}</span>
                  {n.label === 'Cart' && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      0
                    </span>
                  )}
                </button>
              );
            })}

            <div className="relative profile-dropdown">
              <button
                onClick={() => setOpenProfile(!openProfile)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <FiUser className="w-5 h-5" />
                <span className="text-sm font-medium">Profile</span>
                <FiChevronDown className={`w-4 h-4 transition-transform ${openProfile ? 'rotate-180' : ''}`} />
              </button>
              {openProfile && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                  <div className="p-2">
                    <a
                      href="/login"
                      className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      Sign In
                    </a>
                    <a
                      href="/login"
                      className="block px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:from-yellow-600 hover:to-amber-600 rounded-md transition-colors text-center"
                    >
                      Sign Up
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 mt-2 pt-4">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for jewellery..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {NAV_LINKS.map(n => {
                  const Icon = n.icon;
                  return (
                    <button
                      key={n.label}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{n.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CategoryBar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRefs = useRef({});
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (activeDropdown && !e.target.closest('.category-dropdown') && !e.target.closest('.category-dropdown-menu')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeDropdown]);

  useEffect(() => {
    if (activeDropdown) {
      const updatePosition = () => {
        const button = buttonRefs.current[activeDropdown];
        if (button) {
          const rect = button.getBoundingClientRect();
          setDropdownPosition({
            top: rect.bottom + 8,
            left: rect.left,
          });
        }
      };
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [activeDropdown]);

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const handleMouseEnter = (label) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveDropdown(label);
  };

  return (
    <>
      <div className="w-full bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-center gap-2 py-3 overflow-x-auto hide-scrollbar">
            {CATEGORIES.map(cat => (
              <div
                key={cat.label}
                className="relative shrink-0 category-dropdown"
                onMouseEnter={() => handleMouseEnter(cat.label)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  ref={(el) => (buttonRefs.current[cat.label] = el)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(activeDropdown === cat.label ? null : cat.label);
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm border transition-colors ${
                    activeDropdown === cat.label
                      ? 'bg-white text-yellow-600 border-yellow-200'
                      : 'text-gray-700 border-transparent hover:bg-white hover:text-yellow-600 hover:border-yellow-200'
                  }`}
                >
                  <span>{cat.label}</span>
                  <FiChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === cat.label ? 'rotate-180' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {activeDropdown && createPortal(
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden p-4 grid grid-cols-2 gap-3 min-w-[240px] z-50 category-dropdown-menu"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
          }}
          onMouseEnter={() => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
          }}
          onMouseLeave={handleMouseLeave}
        >
          {CATEGORIES.find(cat => cat.label === activeDropdown)?.items.map(item => (
            <a
              key={item}
              href="#"
              className="text-sm text-gray-700 hover:text-yellow-600 whitespace-nowrap px-3 py-1.5 rounded-md hover:bg-yellow-50 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {item}
            </a>
          ))}
        </div>,
        document.body
      )}
    </>
  );
};

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <CategoryBar />
    </div>
  );
};

export default UserDashboard;
