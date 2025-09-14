import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Eye,
  Heart,
  Star,
  Package,
  Users,
  DollarSign,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";

interface ProducerStats {
  producer_id: number;
  total_products: number;
  total_views: number;
  total_favorites: number;
  total_reviews: number;
  average_rating: number;
  products: any[];
}

const ProducerDashboard: React.FC = () => {
  const [stats, setStats] = useState<ProducerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    // Mock producer ID - in real app, get from auth context
    const producerId = 1;
    fetchProducerStats(producerId);
  }, [timeRange]);

  const fetchProducerStats = async (producerId: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/analytics/producer/${producerId}/stats`
      );
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching producer stats:", error);
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

  const statCards = [
    {
      title: "Total Products",
      value: stats?.total_products || 0,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900",
    },
    {
      title: "Total Views",
      value: stats?.total_views || 0,
      icon: Eye,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
    },
    {
      title: "Favorites",
      value: stats?.total_favorites || 0,
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900",
    },
    {
      title: "Reviews",
      value: stats?.total_reviews || 0,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900",
    },
    {
      title: "Average Rating",
      value: stats?.average_rating || 0,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Producer Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your products and track performance
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

            <Link
              to="/products/new"
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Products */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Recent Products
                </h3>
                <Link
                  to="/products"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
            </div>

            <div className="p-6">
              {stats?.products && stats.products.length > 0 ? (
                <div className="space-y-4">
                  {stats.products.slice(0, 5).map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center space-x-4"
                    >
                      <img
                        src={product.image_url || "/api/placeholder/60/60"}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {product.price} MAD
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {product.views || 0}
                        </div>
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          {product.favorites_count || 0}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No products yet. Add your first product to get started!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Performance Overview
              </h3>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Views
                  </span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            (stats?.total_views || 0) / 10
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      {stats?.total_views || 0}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Favorites
                  </span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            (stats?.total_favorites || 0) / 5
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      {stats?.total_favorites || 0}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Reviews
                  </span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            (stats?.total_reviews || 0) / 3
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      {stats?.total_reviews || 0}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Rating
                  </span>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{
                          width: `${(stats?.average_rating || 0) * 20}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      {stats?.average_rating || 0}/5
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Quick Actions
            </h3>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/products/new"
                className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Plus className="h-6 w-6 text-primary-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Add New Product
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Create a new product listing
                  </p>
                </div>
              </Link>

              <Link
                to="/products"
                className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Package className="h-6 w-6 text-primary-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Manage Products
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Edit existing products
                  </p>
                </div>
              </Link>

              <Link
                to="/analytics"
                className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <BarChart3 className="h-6 w-6 text-primary-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    View Analytics
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Detailed performance metrics
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProducerDashboard;
