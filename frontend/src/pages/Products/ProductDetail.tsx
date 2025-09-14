import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Star,
  Heart,
  ShoppingCart,
  Eye,
  ArrowLeft,
  Share2,
  Minus,
  Plus,
  User,
  MapPin,
} from "lucide-react";
import { Product } from "../../types/product";
import { useAuth } from "../../contexts/AuthContext";

interface Review {
  id: number;
  user_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchReviews();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/products/${id}`);
      const data = await response.json();
      setProduct(data.product);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${id}/reviews`
      );
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleAddToCart = () => {
    // TODO: Implement add to cart
    console.log("Add to cart:", { productId: id, quantity });
  };

  const handleToggleFavorite = () => {
    // TODO: Implement favorite toggle
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Product not found
          </h2>
          <button
            onClick={() => navigate("/products")}
            className="text-primary-600 hover:text-primary-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/products")}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-w-1 aspect-h-1">
              <img
                src={product.image_url || "/api/placeholder/600/600"}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>

            {/* Additional Images */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  src={product.image_url || "/api/placeholder/150/150"}
                  alt={`${product.name} ${i}`}
                  className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-75"
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-primary-600 bg-primary-100 dark:bg-primary-900 px-2 py-1 rounded">
                  {product.category}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleToggleFavorite}
                    className={`p-2 rounded-full ${
                      isFavorite
                        ? "text-red-500 bg-red-50 dark:bg-red-900"
                        : "text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900"
                    }`}
                  >
                    <Heart className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900 rounded-full"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h1>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= averageRating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    ({reviews.length} reviews)
                  </span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Eye className="h-4 w-4 mr-1" />
                  <span className="text-sm">{product.views || 0} views</span>
                </div>
              </div>

              <div className="text-3xl font-bold text-primary-600 mb-4">
                {product.price} MAD
              </div>

              {/* Producer Information */}
              {product.producer && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <Link
                          to={`/producer/${product.producer.id}`}
                          className="text-lg font-medium text-gray-900 dark:text-white hover:text-primary-600 transition-colors"
                        >
                          {product.producer.username}
                        </Link>
                        {product.producer.city && (
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{product.producer.city}</span>
                            {product.producer.region && (
                              <span>, {product.producer.region}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <Link
                      to={`/producer/${product.producer.id}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              )}

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {product.description}
              </p>
            </div>

            {/* Quantity and Add to Cart - Only for consumers */}
            {user?.role === "consumer" && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300 dark:border-gray-600">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </button>
                  <button className="px-6 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors">
                    Buy Now
                  </button>
                </div>
              </div>
            )}

            {/* Product Details */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Stock:
                  </span>
                  <span className="font-medium">
                    {product.stock_quantity > 0
                      ? `${product.stock_quantity} available`
                      : "Out of stock"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Producer ID:
                  </span>
                  <span className="font-medium">{product.producer_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Status:
                  </span>
                  <span
                    className={`font-medium ${
                      product.is_active ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {["description", "reviews", "shipping"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-6">
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <p className="text-gray-600 dark:text-gray-400">
                  {product.description}
                </p>
                {product.tags && product.tags.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                      Tags:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Customer Reviews ({reviews.length})
                  </h3>
                  <button className="text-primary-600 hover:text-primary-700 font-medium">
                    Write a Review
                  </button>
                </div>

                {reviews.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No reviews yet. Be the first to review this product!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-gray-200 dark:border-gray-700 pb-4"
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Shipping Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Standard Shipping:
                    </span>
                    <span className="font-medium">3-5 business days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Express Shipping:
                    </span>
                    <span className="font-medium">1-2 business days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Free Shipping:
                    </span>
                    <span className="font-medium">Orders over 200 MAD</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
