import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Home,
  Package,
  BarChart3,
  User,
  Heart,
  Users,
  Shield,
  ShoppingBag,
} from "lucide-react";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  public?: boolean;
  roles?: string[];
}

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navigationItems: NavigationItem[] = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      public: true,
    },
    {
      name: "Products",
      href: "/products",
      icon: Package,
      public: true,
    },
  ];

  const userItems: NavigationItem[] = user
    ? [
        {
          name: "Favorites",
          href: "/favorites",
          icon: Heart,
          roles: ["consumer", "producer", "admin"],
        },
        {
          name: "My Products",
          href: "/my-products",
          icon: ShoppingBag,
          roles: ["producer"],
        },
        {
          name: "Dashboard",
          href: "/dashboard",
          icon: BarChart3,
          roles: ["producer", "admin"],
        },
        {
          name: "Profile",
          href: "/profile",
          icon: User,
          roles: ["consumer", "producer", "admin"],
        },
      ]
    : [];

  const adminItems: NavigationItem[] =
    user?.role === "admin"
      ? [
          {
            name: "Users",
            href: "/admin/users",
            icon: Users,
          },
          {
            name: "Moderation",
            href: "/admin/moderation",
            icon: Shield,
          },
        ]
      : [];

  const allItems = [...navigationItems, ...userItems, ...adminItems];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 hidden lg:block">
      <div className="p-6">
        <nav className="space-y-2">
          {allItems.map((item) => {
            // Check if item should be shown
            if (
              !item.public &&
              (!user || (item.roles && !item.roles.includes(user.role)))
            ) {
              return null;
            }

            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
