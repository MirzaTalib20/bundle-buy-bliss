
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'react-toastify';
import { API_BASE } from '@/config/api';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, ShoppingCart, Star, Image, Download, Shield, Clock, Users, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

interface ProductType {
  id: string;
  name: string;
  description: string;
  detailDescription?: string;
  price: number;
  popular?: boolean;
  image: string;
  rating?: number;
  features?: string[];
  category: string;
  url?: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCartStore();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/products/public`);
      console.log('Fetch response:', response);
      if (response.ok) {
        const products = await response.json();
        setAllProducts(products);
        const foundProduct = products.find((p: ProductType) => p.id === productId);
        
        if (foundProduct) {
          setProduct({
            ...foundProduct,
            rating: foundProduct.rating || 4.5,
            popular: foundProduct.popular || false,
            features: foundProduct.features || [
              "Premium quality digital product",
              "Commercial license included",
              "Instant download after purchase",
              "24/7 customer support"
            ],
            detailDescription: foundProduct.detailDescription || foundProduct.description,
            url: foundProduct.url || ""
          });
        } else {
          setProduct(null);
        }
      } else {
        console.error('Failed to fetch product');
        setProduct(null);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddToCart = () => {
    if (!product) return;
    
    setIsAdding(true);
    
    setTimeout(() => {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
      
      setIsAdding(false);
      
      toast.success(`${product.name} added to cart!`, {
        position: "bottom-right",
        autoClose: 2000
      });
    }, 600);
  };

  useEffect(() => {
    if (product && typeof gtag !== 'undefined') {
      gtag('event', 'view_item', {
        currency: 'INR',
        value: product.price,
        items: [{
          item_id: product.id,
          item_name: product.name,
          price: product.price
        }]
      });
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-6"></div>
          <p className="text-xl font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Image className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/products">Browse All Products</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>{product.name} | Digital Hub</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.image} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto py-4 sm:py-8 px-4">
          {/* Breadcrumb */}
          <div className="mb-4 sm:mb-6">
            <Button variant="ghost" asChild className="p-2 sm:p-3">
              <Link to="/products" className="flex items-center text-primary hover:text-primary/80">
                <ArrowLeft className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Back to Products</span>
                <span className="sm:hidden">Back</span>
              </Link>
            </Button>
          </div>
          
          {/* Main Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-8 lg:mb-16">
            {/* Product Image */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-1"
            >
             <div className="sticky top-4">
  <div className="glass-card rounded-2xl overflow-hidden shadow-2xl">
    {product.image ? (
      <div className="relative aspect-video sm:aspect-square lg:aspect-video flex items-center justify-center bg-white">
        <img 
          src={product.image} 
          alt={product.name} 
          className={`max-h-full max-w-full object-contain object-center transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
            <div className="animate-pulse">
              <Image className="h-16 w-16 text-primary/40" />
            </div>
          </div>
        )}
        {product.popular && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            🔥 Popular
          </div>
        )}
      </div>
    ) : (
      <div className="aspect-video sm:aspect-square lg:aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
        <Image className="h-20 w-20 text-primary/40" />
      </div>
    )}
  </div>
</div>

            </motion.div>
            
            {/* Product Info */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-2 lg:order-2 space-y-6"
            >
              {/* Header */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="inline-block bg-secondary/20 text-secondary text-xs font-semibold px-3 py-1 rounded-full">
                    {product.category || "Digital Product"}
                  </span>
                  {product.popular && (
                    <span className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      🔥 Trending
                    </span>
                  )}
                </div>
                
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating || 4.5) 
                            ? "fill-yellow-500 text-yellow-500" 
                            : "text-gray-300"
                        }`} 
                      />
                    ))}
                    <span className="ml-2 text-lg font-medium text-gray-700">
                      {product.rating || "4.5"}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-1" />
                    <span>1000+ customers</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-lg leading-relaxed">
                </p>
              </div>
              
              {/* Pricing */}
              <div className="bg-white rounded-xl p-6 shadow-lg border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                        ₹{product.price}
                      </span>
                      <span className="text-xl text-gray-500 line-through">
                        ₹{(product.price * 2).toFixed(0)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                        50% OFF
                      </span>
                      <span className="text-sm text-gray-500">Limited time offer</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={handleAddToCart}
                      size="lg"
                      className="btn-gradient w-full sm:w-auto min-w-[200px] h-12 text-lg font-semibold"
                      disabled={isAdding}
                    >
                      {isAdding ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Adding...
                        </div>
                      ) : (
                        <>
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                    
                    {product.url && (
                      <Button
                        variant="outline"
                        size="lg"
                        asChild
                        className="w-full sm:w-auto min-w-[200px] h-12"
                      >
                        <a href={product.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-5 w-5" />
                          Preview
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4">
               
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Commercial License</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <Clock className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">24/7 Support</p>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Product Details Tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8 lg:mb-16"
          >
            <div className="glass-card rounded-2xl overflow-hidden shadow-xl">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200 bg-white/50">
                <div className="flex overflow-x-auto">
                  {[
                    { id: 'description', label: 'Description' },
                    { id: 'features', label: 'Features' },
                    { id: 'details', label: 'Details' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                        activeTab === tab.id
                          ? 'text-primary border-b-2 border-primary bg-primary/5'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Tab Content */}
              <div className="p-6 lg:p-8">
                {activeTab === 'description' && (
                  <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700">
                    <div 
                      className="text-gray-700 leading-relaxed space-y-4"
                      dangerouslySetInnerHTML={{ 
                        __html: product.detailDescription || product.description 
                      }} 
                    />
                  </div>
                )}
                
                {activeTab === 'features' && (
                  <div className="grid gap-4">
                    {product.features?.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                        <Check className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {activeTab === 'details' && (
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold mb-4">Product Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b">
                          <span className="font-medium">Category:</span>
                          <span>{product.category}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="font-medium">Rating:</span>
                          <span>{product.rating || "4.5"}/5</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="font-medium">License:</span>
                          <span>Commercial</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="font-medium">Format:</span>
                          <span>Digital Download</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold mb-4">What's Included</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-green-500" />
                          <span>High-quality digital files</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-green-500" />
                          <span>Commercial usage rights</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-green-500" />
                          <span>Instant download access</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-green-500" />
                          <span>Customer support</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          
          {/* Related Products */}
          {allProducts.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allProducts
                  .filter(p => p.id !== product.id)
                  .slice(0, 3)
                  .map((relatedProduct, index) => (
                    <motion.div 
                      key={relatedProduct.id}
                      className="glass-card rounded-xl overflow-hidden card-hover group"
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.3 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <Link to={`/product/${relatedProduct.id}`}>
                        <div className="relative">
                          {relatedProduct.image ? (
                            <img 
                              src={relatedProduct.image} 
                              alt={relatedProduct.name} 
                              className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-48 sm:h-56 bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                              <Image className="h-12 w-12 text-primary/50" />
                            </div>
                          )}
                          
                          {relatedProduct.popular && (
                            <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              Popular
                            </div>
                          )}
                        </div>
                        
                        <div className="p-4 sm:p-6">
                          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {relatedProduct.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {relatedProduct.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-primary">
                              ₹{relatedProduct.price}
                            </span>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                              <span className="text-sm font-medium">
                                {relatedProduct.rating || "4.5"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
