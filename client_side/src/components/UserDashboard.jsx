import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import { FiHeart, FiShoppingCart, FiUser, FiPhone, FiChevronDown, FiChevronLeft, FiChevronRight, FiSearch, FiMenu, FiX, FiLogOut, FiSettings } from 'react-icons/fi';

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

const BANNERS = [
  { type: 'image', src: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1920&auto=format&fit=crop', alt: 'Jewellery Banner 1', title: 'Luxury Collection', subtitle: 'Discover timeless elegance' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1920&auto=format&fit=crop', alt: 'Jewellery Banner 2', title: 'Exclusive Designs', subtitle: 'Crafted to perfection' },
  { type: 'video', src: 'https://cdn.coverr.co/videos/coverr-woman-posing-with-jewelry-6408/1080p.mp4', alt: 'Jewellery Video', title: 'Premium Quality', subtitle: 'Your perfect choice' },
];

const FEATURED_CATEGORIES = [
  { name: 'Best Sellers', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop', count: '150+' },
  { name: 'New Arrivals', image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=800&auto=format&fit=crop', count: '45+' },
  { name: 'Coins & Bars', image: 'https://images.unsplash.com/photo-1621796378-13c53d19e6d1?q=80&w=800&auto=format&fit=crop', count: '80+' },
  { name: 'Coin Pendants', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop', count: '60+' },
  { name: 'Silver Coins', image: 'https://images.unsplash.com/photo-1621796378-13c53d19e6d1?q=80&w=800&auto=format&fit=crop', count: '90+' },
  { name: 'Gold Jhumka', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop', count: '120+' },
];

const TopBar = () => {
  const [openProfile, setOpenProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openProfile && !e.target.closest('.profile-dropdown')) {
        setOpenProfile(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openProfile]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      setOpenProfile(false);
      navigate('/');
    } catch (error) {
      setOpenProfile(false);
      navigate('/');
    }
  };

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

          <div className="flex items-center gap-2 md:gap-4">
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
            </div>

            <div className="relative profile-dropdown">
              <button
                onClick={() => setOpenProfile(!openProfile)}
                className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <FiUser className="w-5 h-5" />
                <span className="hidden md:inline text-sm font-medium">Profile</span>
                <FiChevronDown className={`w-4 h-4 transition-transform ${openProfile ? 'rotate-180' : ''}`} />
              </button>
              {openProfile && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                  <div className="p-2">
                    {isAuthenticated ? (
                      <>
                        <Link
                          to="/account"
                          onClick={() => setOpenProfile(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                        >
                          <FiSettings className="w-4 h-4" />
                          Account
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <FiLogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/user/login"
                          onClick={() => setOpenProfile(false)}
                          className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/user/signup"
                          onClick={() => setOpenProfile(false)}
                          className="block px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:from-yellow-600 hover:to-amber-600 rounded-md transition-colors text-center"
                        >
                          Sign Up
                        </Link>
                      </>
                    )}
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
                {NAV_LINKS.filter(n => n.label !== 'Profile').map(n => {
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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 240 });
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
          const windowWidth = window.innerWidth;
          const padding = 16;
          const dropdownWidth = Math.min(240, windowWidth - 32);
          
          let left = rect.left;
          
          if (left + dropdownWidth > windowWidth - padding) {
            left = windowWidth - dropdownWidth - padding;
          }
          
          if (left < padding) {
            left = padding;
          }
          
          setDropdownPosition({
            top: rect.bottom + 8,
            left: left,
            width: dropdownWidth,
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
        <div className="w-full relative">
          <div className="flex items-center gap-2 py-3 overflow-x-auto hide-scrollbar px-4 sm:px-6 lg:px-8 lg:justify-center" style={{ WebkitOverflowScrolling: 'touch' }}>
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
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm border transition-colors whitespace-nowrap ${
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
          className="fixed bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden p-4 grid grid-cols-2 gap-3 z-50 category-dropdown-menu"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            maxWidth: 'calc(100vw - 32px)',
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

const HeroCarousel = () => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setIndex(i => (i + 1) % BANNERS.length), 6000);
    return () => clearInterval(timerRef.current);
  }, []);

  const prev = () => {
    setIndex(i => (i - 1 + BANNERS.length) % BANNERS.length);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setIndex(i => (i + 1) % BANNERS.length), 6000);
  };

  const next = () => {
    setIndex(i => (i + 1) % BANNERS.length);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setIndex(i => (i + 1) % BANNERS.length), 6000);
  };

  const current = BANNERS[index];

  return (
    <div className="relative w-full rounded-2xl shadow-xl group">
      <div className="relative h-[400px] sm:h-[500px] md:h-[600px]">
        {current.type === 'image' ? (
          <img
            src={current.src}
            alt={current.alt}
            className="w-full h-full object-cover rounded-2xl"
          />
        ) : (
          <video
            className="w-full h-full object-cover rounded-2xl"
            src={current.src}
            autoPlay
            muted
            loop
            playsInline
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent rounded-2xl" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-2xl px-6 sm:px-10 md:px-12 text-white">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
              {current.title}
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-6">
              {current.subtitle}
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
              Shop Now
            </button>
          </div>
        </div>

        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <FiChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <FiChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const FeaturedSection = () => (
  <div className="w-full mt-12">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Shop by Category</h2>
        <p className="text-gray-600 mt-1">Explore our curated collections</p>
      </div>
      <button className="hidden sm:flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-medium">
        View All
        <FiChevronRight className="w-5 h-5" />
      </button>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
      {FEATURED_CATEGORIES.map((cat) => (
        <div
          key={cat.name}
          className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer"
        >
          <div className="aspect-square relative">
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
              <h3 className="font-semibold text-sm sm:text-base mb-1">{cat.name}</h3>
              <p className="text-xs text-gray-200">{cat.count} items</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <CategoryBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HeroCarousel />
        <FeaturedSection />
      </main>
    </div>
  );
};

export default UserDashboard;
