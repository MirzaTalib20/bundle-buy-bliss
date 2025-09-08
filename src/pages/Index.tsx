
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/button';
import CountdownTimer from '@/components/CountdownTimer';
import { Check, Box, Users, ArrowRight, Brain, Target, Laptop, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import NotificationSystem from '@/components/NotificationSystem';
import ProductCard from '@/components/ProductCard';
import ReviewSection from '@/components/ReviewSection';
import VideoSection from '@/components/VideoSection';
import ContactForm from '@/components/ContactForm';
import SalesCounter from '@/components/SalesCounter';
import img from "@/assest/img/pan.jpg";
import img1 from "@/assest/img/themes.jpg";
import img2 from "@/assest/img/adboe.jpg";
import img3 from "@/assest/img/digital.jpg";
import img4 from "@/assest/img/youtube.jpg";
import img5 from "@/assest/img/premiumtshirt.png";
import img6 from "@/assest/img/canva.jpg";
import homeImg from "@/assest/img/Home.png";
import { useToast } from "@/hooks/use-toast";
import { Link } from 'react-router-dom';
import { API_BASE } from '@/config/api';
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

const BUNDLE_PRICE = 499;

const productData: ProductType[] = []


const featuresData =[];
const whoIsForData = [];

const Index = () => {
  const { addItem } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Auto scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/products/public`);
      
      if (response.ok) {
        const data = await response.json();
        // Transform database products to match ProductType interface
        const transformedProducts = data.map(product => ({
          ...product,
          rating: product.rating || 4.5,
          popular: product.popular || false,
          features: product.features || [],
          detailDescription: product.detailDescription || product.description,
          url: product.url || ""
        }));
        setProducts(transformedProducts);
      } else {
        console.error('Failed to fetch products from database');
        // Fallback to static data if API fails
        setProducts(productData);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Fallback to static data if API fails
      setProducts(productData);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    
    setTimeout(() => {
      products
        .filter(product => product.popular)
        .forEach(product => {
          addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
          });
        });
      
      setIsAdding(false);
      
      const popularProducts = products.filter(product => product.popular);
      toast({
        title: "Success!",
        description: `Product added to cart! ${popularProducts.length} items added.`,
      });
    }, 600);
  };

  const handleGetStarted = () => {
    const featuredSection = document.getElementById('featured-products');
    if (featuredSection) {
      featuredSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NotificationSystem />
      
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1 space-y-6">
              <div className="inline-block px-4 py-1.5 rounded-full border border-primary/50 bg-primary/10">
                <p className="text-sm font-medium text-primary">Limited Time Offer</p>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                Boost Your Business with <span className="gradient-text">The Floo Hub</span>  Unbeatable Prices!
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl">
                Create and sell unlimited digital products with our massive product of premium assets. 
                
              </p>
              
              <div className="flex flex-wrap gap-6 pt-2">
                {featuresData.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <feature.icon className="h-5 w-5 text-primary" />
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-4">
                <CountdownTimer initialHours={23} initialMinutes={59} initialSeconds={59} />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button
                  size="lg"
                  className="text-lg btn-gradient"
                  disabled={isAdding}
                  onClick={handleAddToCart}
                >
                  {isAdding ? "Adding..." : "Add to Cart"}
                  {!isAdding && <ArrowRight className="ml-2 h-5 w-5" />}
                </Button>
                
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">₹  {BUNDLE_PRICE}</span>
                    <span className="text-xl text-muted-foreground line-through">₹{(BUNDLE_PRICE * 3).toFixed(2)}</span>
                  </div>
                  <span className="text-green-600 text-sm">Save 80% Today!</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 pt-4">
                <div className="flex gap-2">
                  <img src="https://cdn-icons-png.flaticon.com/512/196/196566.png" alt="Visa" className="h-8" />
                  <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="UPI" className="h-8" />
                  <img src="https://cdn-icons-png.flaticon.com/512/825/825454.png" alt="Razorpay" className="h-8" />
                </div>
                <span className="text-sm text-muted-foreground">Secure Payment</span>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent rounded-full blur-xl"></div>
                <div className="glass-card rounded-xl overflow-hidden relative z-10 card-hover">
                  <img 
                    src={img6}
                    alt="Product Preview" 
                    className="w-full h-auto rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold"></h3>
                    <p className="text-muted-foreground"></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Products Section */}
      <section id="featured-products" className="section-padding bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured <span className="highlight">Products</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our most popular digital products designed to help you grow your business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="glass-card p-4 rounded-xl animate-pulse">
                  <div className="h-48 bg-muted rounded-lg mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded mb-4"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </div>
              ))
            ) : (
              products
                .filter(product => product.popular)
                .slice(0, 8)
                .map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={{...product, url: product.url ?? ''}} 
                  />
                ))
            )}
          </div>

          <div className="text-center mt-8">
            <Link to="/products">
              <Button size="lg" variant="outline" className="btn-gradient">
                View More Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Video Section */}
      <VideoSection />
      
      {/* Sales Counter */}
      <SalesCounter />
      
      {/* Who Is For Section */}
      <section className="section-padding bg-muted">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Who Is This <span className="highlight">For?</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our Product is perfect for a variety of creators and professionals looking to enhance their digital assets.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whoIsForData.map((item, index) => (
              <motion.div 
                key={index} 
                className="glass-card p-6 rounded-xl card-hover"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Review Section */}
      <ReviewSection />
      
      {/* Contact Section */}
      <ContactForm />
      
      {/* CTA Section */}
      <section className="section-padding relative overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="absolute inset-0 bg-hero-pattern opacity-30"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Creating?</h2>
            <p className="text-muted-foreground mb-8">
              Get instant access to 2000+ premium items, start creating professional digital products today.
            </p>
            
            <Button
              size="lg"
              className="text-lg btn-gradient"
              onClick={handleGetStarted}
            >
              Get Started Now - Just ₹{BUNDLE_PRICE}
            </Button>
            
            <div className="mt-6">
              <CountdownTimer initialHours={23} initialMinutes={59} initialSeconds={59} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
