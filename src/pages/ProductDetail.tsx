
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'react-toastify';
import { API_BASE } from '@/config/api';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, ShoppingCart, Star, Image } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

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
      
      if (response.ok) {
        const products = await response.json();
        setAllProducts(products); // Store all products for related products
        const foundProduct = products.find((p: ProductType) => p.id === productId);
        
        if (foundProduct) {
          setProduct({
            ...foundProduct,
            rating: foundProduct.rating || 4.5,
            popular: foundProduct.popular || false,
            features: foundProduct.features || [],
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
        quantity: 1
      });
      
      setIsAdding(false);
      
      toast.success(`${product.name} added to cart!`, {
        position: "bottom-right",
        autoClose: 2000
      });
    }, 600);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link to="/" className="flex items-center text-primary hover:text-primary/80">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl overflow-hidden shadow-lg"
        >
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-auto object-cover aspect-video"
            />
          ) : (
            <div className="w-full aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
              <Image className="h-16 w-16 text-primary/40" />
            </div>
          )}
        </motion.div>
        
        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {product.popular && (
                  <span className="inline-block bg-primary text-white text-xs font-semibold px-2 py-1 rounded">
                    Popular
                  </span>
                )}
                <span className="inline-block bg-secondary/10 text-secondary text-xs font-semibold px-2 py-1 rounded">
                  {product.category || "Product"}
                </span>
              </div>
              
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.floor(product.rating || 4.5) ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`} 
                  />
                ))}
                <span className="ml-1 text-sm font-medium">{product.rating || "4.5"}</span>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
            <p className="text-muted-foreground mt-1">{product.description}</p>
          </div>
          
          <div className="flex items-center">
            <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
            <span className="text-xl text-muted-foreground line-through ml-2">${(product.price * 2).toFixed(2)}</span>
            <span className="ml-2 inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
              50% OFF
            </span>
          </div>
          
          <div>
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="btn-gradient w-full sm:w-auto mr-4"
              disabled={isAdding}
            >
              {isAdding ? "Adding..." : "Add to Cart"}
              {!isAdding && <ShoppingCart className="ml-2 h-5 w-5" />}
            </Button>
          </div>
          
          <div className="border-t border-border pt-4">
            <h3 className="text-lg font-semibold mb-2">Key Features:</h3>
            <ul className="space-y-2">
              {product.features ? (
                product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))
              ) : (
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Premium quality digital product</span>
                </li>
              )}
            </ul>
          </div>
        </motion.div>
      </div>
      
      {/* Product Details Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Product Details</h2>
        <Card>
          <CardContent className="p-6">
            <p className="text-lg leading-relaxed">
              {product.detailDescription || product.description}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Related Products */}
      <div>
        <h2 className="text-2xl font-bold mb-4">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allProducts
            .filter(p => p.id !== product.id)
            .slice(0, 3)
            .map(relatedProduct => (
              <motion.div 
                key={relatedProduct.id}
                className="glass-card rounded-xl overflow-hidden card-hover"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Link to={`/product/${relatedProduct.id}`}>
                  <div className="relative">
                    {relatedProduct.image ? (
                      <img 
                        src={relatedProduct.image} 
                        alt={relatedProduct.name} 
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                        <Image className="h-12 w-12 text-primary/50" />
                      </div>
                    )}
                    
                    {relatedProduct.popular && (
                      <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                        Popular
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{relatedProduct.name}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{relatedProduct.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">${relatedProduct.price.toFixed(2)}</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
                        <span className="text-sm">{relatedProduct.rating || "4.5"}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
