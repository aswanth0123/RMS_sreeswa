import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiShoppingBag, 
  FiUsers, 
  FiPackage, 
  FiUser, 
  FiLogOut,
  FiX,
  FiMenu
} from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose, user, onLogout }) => {
  console.log(user,'user');
  
  const isSuperAdmin = user?.role === 'superadmin';
  
  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: FiHome,
    },
    ...(isSuperAdmin ? [
      {
        name: 'Shops',
        href: '/shops',
        icon: FiShoppingBag,
      },
      {
        name: 'Employees',
        href: '/employees',
        icon: FiUsers,
      },
      {
        name: 'Products',
        href: '/products',
        icon: FiPackage,
      },
      {
        name: 'Users',
        href: '/users',
        icon: FiUser,
      },
    ] : [
      {
        name: 'Products',
        href: '/products',
        icon: FiPackage,
      },
      {
        name: 'Employees',
        href: '/employees',
        icon: FiUsers,
      },
    ]),
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 h-[100vh] bg-white shadow-lg transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        w-64
        flex flex-col
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">RMS</span>
            </div>
            <span className="text-lg font-semibold text-gray-800 whitespace-nowrap">
              Restaurant MS
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <FiX className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 flex-1">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    className={({ isActive }) => `
                      flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200
                      ${isActive 
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="whitespace-nowrap">
                      {item.name}
                    </span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="whitespace-nowrap">
              <p className="text-sm font-medium text-gray-800">{user?.username}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className="flex items-center space-x-3 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <FiLogOut className="w-5 h-5 shrink-0" />
            <span className="whitespace-nowrap">
              Logout
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
