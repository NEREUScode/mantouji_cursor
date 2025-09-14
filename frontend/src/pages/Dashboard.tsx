import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ProducerDashboard from "./Dashboard/ProducerDashboard";
import AdminDashboard from "./Dashboard/AdminDashboard";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  // Render appropriate dashboard based on user role
  if (user.role === "producer") {
    return <ProducerDashboard />;
  }

  if (user.role === "admin") {
    return <AdminDashboard />;
  }

  // For consumers, show a simple dashboard or redirect to products
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Welcome, {user.username}!
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Browse Products
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Discover amazing regional products from local producers
            </p>
            <button
              onClick={() => navigate("/products")}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
            >
              View Products
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Your Favorites
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              View and manage your favorite products
            </p>
            <button
              onClick={() => navigate("/favorites")}
              className="w-full bg-secondary-600 text-white py-2 px-4 rounded-lg hover:bg-secondary-700 transition-colors"
            >
              View Favorites
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Your Profile
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Manage your account settings and preferences
            </p>
            <button
              onClick={() => navigate("/profile")}
              className="w-full bg-accent-600 text-white py-2 px-4 rounded-lg hover:bg-accent-700 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
