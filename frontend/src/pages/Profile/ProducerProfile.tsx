import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, MapPin, Calendar, Package, Heart, Eye } from "lucide-react";
import { Product } from "../../types/product";

interface Producer {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  email: string;
  city?: string;
  region?: string;
  country?: string;
  created_at: string;
}

const ProducerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [producer, setProducer] = useState<Producer | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducerData = async () => {
    try {
      setLoading(true);
      
      // Fetch producer info
      const producerResponse = await fetch(`http://localhost:5000/api/users/${id}`);
      const producerData = await producerResponse.json();
      setProducer(producerData);

      // Fetch producer's products
      const productsResponse = await fetch(`http://localhost:5000/api/products?producer_id=${id}`);
      const productsData = await productsResponse.json();
      setProducts(productsData.products || []);
    } catch (error) {
      console.error("Error fetching producer data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProducerData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!producer) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Producer Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The producer you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const producerName = producer.first_name && producer.last_name 
    ? `${producer.first_name} ${producer.last_name}`
    : producer.username;

  const location = [producer.city, producer.region, producer.country]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Producer Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {producerName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {producerName}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  @{producer.username}
                </p>
                {location && (
                  <div className="flex items-center mt-2 text-gray-500 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{location}</span>
                  </div>
                )}
                <div className="flex items-center mt-2 text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    Member since {new Date(producer.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 md:mt-0 flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {products.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Products
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Products by {producerName}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {products.length} product{products.length !== 1 ? 's' : ''} available
            </p>
          </div>

          {products.length > 0 ? (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={product.image_url || "/api/placeholder/400/300"}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-primary-600">
                          {product.price} MAD
                        </span>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Star className="h-4 w-4 mr-1 fill-current text-yellow-400" />
                          <span>{product.average_rating || 0}</span>
                          <span className="ml-1">({product.review_count || 0})</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          <span>{product.views || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          <span>{product.favorites_count || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <Package className="h-4 w-4 mr-1" />
                          <span>{product.stock_quantity}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {product.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {product.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                            +{product.tags.length - 3} more
                          </span>
                        )}
                      </div>

                      <Link
                        to={`/products/${product.id}`}
                        className="block w-full text-center bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        View Product
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Products Yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {producerName} hasn't added any products yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProducerProfile;
