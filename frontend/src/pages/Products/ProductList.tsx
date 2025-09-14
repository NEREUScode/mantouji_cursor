import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Star, Heart, Eye, ShoppingCart, User } from "lucide-react";
import { Product } from "../../types/product";
import { useAuth } from "../../contexts/AuthContext";

interface ProductFilters {
  search: string;
  category: string;
  minPrice: number | "";
  maxPrice: number | "";
  sortBy: string;
}

const ProductList: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "newest",
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 12,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [filters, pagination.page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        per_page: pagination.per_page.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.category && { category: filters.category }),
        ...(filters.minPrice && { min_price: filters.minPrice.toString() }),
        ...(filters.maxPrice && { max_price: filters.maxPrice.toString() }),
        ...(filters.sortBy && { sort_by: filters.sortBy }),
      });

      const response = await fetch(
        `http://localhost:5000/api/products?${params}`
      );
      const data = await response.json();

      setProducts(data.products || []);
      setPagination((prev) => ({
        ...prev,
        total: data.total || 0,
        pages: data.pages || 0,
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/products/categories"
      );
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleFilterChange = (
    key: keyof ProductFilters,
    value: string | number
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "newest",
    });
  };

  const toggleFavorite = async (productId: number) => {
    // TODO: Implement favorite toggle
    console.log("Toggle favorite:", productId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Discover Regional Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find authentic products from local producers across Morocco
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Search
              </button>
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Min Price (MAD)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) =>
                    handleFilterChange(
                      "minPrice",
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Max Price (MAD)
                </label>
                <input
                  type="number"
                  placeholder="1000"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    handleFilterChange(
                      "maxPrice",
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="newest">Newest</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={clearFilters}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear Filters
              </button>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {pagination.total} products found
              </span>
            </div>
          </form>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-600 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No products found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search criteria
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={product.image_url || "/api/placeholder/300/200"}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md transition-shadow"
                    >
                      <Heart className="h-4 w-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-primary-600 bg-primary-100 dark:bg-primary-900 px-2 py-1 rounded">
                        {product.category}
                      </span>
                      <div className="flex items-center text-yellow-400">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                          4.5
                        </span>
                      </div>
                    </div>

                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {product.name}
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Producer Info */}
                    {product.producer && (
                      <div className="mb-3">
                        <Link
                          to={`/producer/${product.producer.id}`}
                          className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
                        >
                          <User className="h-4 w-4 mr-1" />
                          <span className="font-medium">{product.producer.username}</span>
                          {product.producer.city && (
                            <span className="ml-1">• {product.producer.city}</span>
                          )}
                        </Link>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary-600">
                        {product.price} MAD
                      </span>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        {user?.role === "consumer" && (
                          <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                            <ShoppingCart className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <Link
                      to={`/products/${product.id}`}
                      className="block w-full mt-3 bg-primary-600 text-white text-center py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: Math.max(1, prev.page - 1),
                    }))
                  }
                  disabled={pagination.page === 1}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Previous
                </button>

                {Array.from(
                  { length: Math.min(5, pagination.pages) },
                  (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() =>
                          setPagination((prev) => ({ ...prev, page }))
                        }
                        className={`px-3 py-2 rounded-lg ${
                          pagination.page === page
                            ? "bg-primary-600 text-white"
                            : "border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                )}

                <button
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      page: Math.min(prev.pages, prev.page + 1),
                    }))
                  }
                  disabled={pagination.page === pagination.pages}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductList;
