import React, { useState, useEffect } from "react";
import {
  Users,
  Package,
  Star,
  Search,
  Shield,
  AlertTriangle,
  TrendingUp,
  BarChart3,
} from "lucide-react";

interface AdminOverview {
  total_users: number;
  total_products: number;
  total_reviews: number;
  total_favorites: number;
  total_searches: number;
  role_distribution: Record<string, number>;
  category_distribution: Record<string, number>;
}

const AdminDashboard: React.FC = () => {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    fetchAdminOverview();
  }, [timeRange]);

  const fetchAdminOverview = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/analytics/admin/overview"
      );
      const data = await response.json();
      setOverview(data);
    } catch (error) {
      console.error("Error fetching admin overview:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const overviewCards = [
    {
      title: "Total Users",
      value: overview?.total_users || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900",
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Total Products",
      value: overview?.total_products || 0,
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      title: "Total Reviews",
      value: overview?.total_reviews || 0,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900",
      change: "+15%",
      changeType: "positive" as const,
    },
    {
      title: "Total Searches",
      value: overview?.total_searches || 0,
      icon: Search,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900",
      change: "+23%",
      changeType: "positive" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Platform overview and moderation tools
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {overviewCards.map((card, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {card.value.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">
                      {card.change}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                      vs last period
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Role Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                User Role Distribution
              </h3>
            </div>

            <div className="p-6">
              {overview?.role_distribution &&
              Object.keys(overview.role_distribution).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(overview.role_distribution).map(
                    ([role, count]) => (
                      <div
                        key={role}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-primary-600 rounded-full mr-3"></div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                            {role}s
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                            <div
                              className="bg-primary-600 h-2 rounded-full"
                              style={{
                                width: `${
                                  (count / (overview?.total_users || 1)) * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {count}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No user data available
                </p>
              )}
            </div>
          </div>

          {/* Product Category Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Product Categories
              </h3>
            </div>

            <div className="p-6">
              {overview?.category_distribution &&
              Object.keys(overview.category_distribution).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(overview.category_distribution)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([category, count]) => (
                      <div
                        key={category}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {category}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{
                                width: `${
                                  (count / (overview?.total_products || 1)) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {count}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No category data available
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Moderation Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Pending Reviews */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Pending Reviews
                </h3>
                <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded-full">
                  3 pending
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Review #{i}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Product: Sample Product {i}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded">
                        Approve
                      </button>
                      <button className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Flagged Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Flagged Content
                </h3>
                <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-medium rounded-full">
                  2 flagged
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Product #{i}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Inappropriate content
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* System Alerts */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                System Alerts
              </h3>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      High Server Load
                    </p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                      Server response time is above normal
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Security Scan Complete
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      No vulnerabilities found
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Quick Actions
            </h3>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Users className="h-6 w-6 text-primary-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">
                    Manage Users
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    View and edit user accounts
                  </p>
                </div>
              </button>

              <button className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Package className="h-6 w-6 text-primary-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">
                    Moderate Products
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Review product listings
                  </p>
                </div>
              </button>

              <button className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <BarChart3 className="h-6 w-6 text-primary-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">
                    View Reports
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Generate platform reports
                  </p>
                </div>
              </button>

              <button className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Shield className="h-6 w-6 text-primary-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">
                    Security Settings
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Configure security options
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
