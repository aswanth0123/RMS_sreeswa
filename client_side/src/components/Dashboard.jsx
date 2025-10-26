import React from 'react';
import { useSelector } from 'react-redux';
import { FiShoppingBag, FiUsers, FiPackage, FiTrendingUp, FiDollarSign, FiActivity } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const isSuperAdmin = user?.role === 'superadmin';

  // Mock data - replace with real API calls
  const stats = isSuperAdmin ? [
    { name: 'Total Shops', value: '24', icon: FiShoppingBag, color: 'bg-blue-500' },
    { name: 'Total Users', value: '1,234', icon: FiUsers, color: 'bg-green-500' },
    { name: 'Total Products', value: '5,678', icon: FiPackage, color: 'bg-purple-500' },
    { name: 'Revenue', value: '$45,678', icon: FiDollarSign, color: 'bg-yellow-500' },
  ] : [
    { name: 'Total Products', value: '156', icon: FiPackage, color: 'bg-blue-500' },
    { name: 'Employees', value: '12', icon: FiUsers, color: 'bg-green-500' },
    { name: 'Sales Today', value: '$2,345', icon: FiTrendingUp, color: 'bg-purple-500' },
    { name: 'Orders', value: '89', icon: FiActivity, color: 'bg-yellow-500' },
  ];

  const recentActivities = isSuperAdmin ? [
    { action: 'New shop registered', time: '2 hours ago', type: 'shop' },
    { action: 'Product added by Shop A', time: '4 hours ago', type: 'product' },
    { action: 'User login from Shop B', time: '6 hours ago', type: 'user' },
  ] : [
    { action: 'New order received', time: '1 hour ago', type: 'order' },
    { action: 'Product restocked', time: '3 hours ago', type: 'product' },
    { action: 'Employee clocked in', time: '5 hours ago', type: 'employee' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.username || 'User'}!
        </h1>
        <p className="text-blue-100">
          {isSuperAdmin 
            ? 'Here\'s what\'s happening with your restaurant management system.' 
            : 'Here\'s your shop overview and recent activity.'
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                <div>
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {isSuperAdmin ? (
              <>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <p className="font-medium text-gray-900">Manage Shops</p>
                  <p className="text-sm text-gray-500">Add, edit, or remove shops</p>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <p className="font-medium text-gray-900">User Management</p>
                  <p className="text-sm text-gray-500">Manage system users</p>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <p className="font-medium text-gray-900">System Settings</p>
                  <p className="text-sm text-gray-500">Configure system preferences</p>
                </button>
              </>
            ) : (
              <>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <p className="font-medium text-gray-900">Add Product</p>
                  <p className="text-sm text-gray-500">Add new products to inventory</p>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <p className="font-medium text-gray-900">Manage Staff</p>
                  <p className="text-sm text-gray-500">Add or edit employee details</p>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <p className="font-medium text-gray-900">View Reports</p>
                  <p className="text-sm text-gray-500">Check sales and performance</p>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
