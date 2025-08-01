
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
import img6 from "@/assest/img/canva.png";
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

const productData: ProductType[] = [
  {
    id: "200+ Crore Pan India Database",
    name: "200+ Crore Pan India Database",
    description: "2000+ premium items with commercial license",
    detailDescription: "Are you ready to take your business to new heights? Look no further! Our exclusive bundle offers an astounding <strong>200+ Crore Pan India Database,</strong> providing you with an invaluable resource for targeted marketing and growth. 💼💎📊",
    price: 199,
    popular: true,
    image: img,
    rating: 4.9,
    features: [
      "Commercial license for all items",
      "Ready-to-sell digital products",
      "Lifetime access and updates",
      "Multiple niches covered"
    ],
    category: "Digital Assets",
    url:"https://turbopayz.com/view-product/XGtB7JE1ZrmqV6C71gMwi8v0"
  },
  {
    id: "Themes & Pluggin",
    name: "Themes & Pluggins Pack",
    description: "Complete digital Pluggins",
    detailDescription: "Transform your marketing skills with our comprehensive Digital Marketing Masterclass. This all-in-one course pack covers everything from social media strategy to SEO, content marketing, email campaigns, and paid advertising. Perfect for beginners and intermediate marketers looking to sharpen their skills.",
    price: 149,
    popular: false,
    image: img1,
    rating: 4.8,
    features: [
      "15+ hours of video content",
      "Practical assignments and case studies",
      "Marketing templates and tools",
      "Certificate of completion"
    ],
    category: "Courses",
    url:"https://turbopayz.com/view-product/XGtB7JE1ZrmqV6C71gMwi8v0"
  },
  {
    id: "ecommerce-toolkit",
    name: "E-commerce Toolkit and Premium Data",
    description: "10000+ templates and automation tools",
    detailDescription: "Launch and scale your online store with our E-commerce Toolkit. This comprehensive package includes 100+ customizable templates for product pages, emails, and social media posts, along with powerful automation tools to streamline your operations and boost sales.",
    price: 189,
    popular: true,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2574",
    rating: 4.7,
    features: [
      "Shopify and WooCommerce compatible",
      "Email marketing automation sequences",
      "Product page templates",
      "Upsell and cross-sell frameworks"
    ],
    category: "Tools",
    url:"https://turbopayz.com/view-product/XGtB7JE1ZrmqV6C71gMwi8v0"
  },
  {
    id: "design-assets-bundle",
    name: "Adobe Premium Software",
    description: "5000+ premium Software assest",
    detailDescription: "Elevate your creative projects with our Design Assets Bundle. Featuring over 500 premium design elements including icons, illustrations, mockups, templates, and more. Perfect for designers, marketers, and content creators looking to enhance their visual content without starting from scratch.",
    price: 299,
    popular: false,
    image: img2,
    rating: 4.6,
    features: [
      "Vector graphics and illustrations",
      "Fully customizable elements",
      "Compatible with major design software",
      "Regular updates with new assets"
    ],
    category: "Design"
  },
  {
    id: "social-media-pack",
    name: "Digital Market Media & Social Media Course Pack",
    description: "2000+ templates for all platforms",
    detailDescription: "Create stunning social media content with our comprehensive Social Media Pack. Featuring 200+ professionally designed templates optimized for Instagram, Facebook, Twitter, LinkedIn, and TikTok. Save time and boost engagement with eye-catching posts that convert followers into customers.",
    price: 169,
    popular: true,
    image: img3,
    rating: 4.8,
    features: [
      "Platform-specific size templates",
      "Seasonal and promotional themes",
      "Caption suggestions and hashtag sets",
      "Content calendar planner"
    ],
    category: "Social Media"
  },
  {
    id: "ai-copywriting-tools",
    name: "50000+ Youtube Long & Short Videos",
    description: "Next-genertatio Long & Short Videos writing assistant suite",
    detailDescription: "Revolutionize your content creation process with our AI Copywriting Tools. This comprehensive suite of writing assistants helps you craft compelling copy for websites, emails, ads, product descriptions, and more. Powered by advanced language models to ensure high-quality, engaging content every time.",
    price: 199,
    popular: true,
    image: img4,
    rating: 4.9,
    features: [
      "Multiple content types and tones",
      "SEO-optimized content generation",
      "Headline and subject line optimizer",
      "Unlimited content generation"
    ],
    category: "AI Tools"
  },
  {
    id: "seo-toolkit",
    name: "Premium T-Shirt Design Bundle",
    description: "1 Lakh Plus Trending T-shirt Design Mega Bundle🥳🥳",
    detailDescription: "Boost your website's visibility with our complete SEO Toolkit Pro. This comprehensive suite includes keyword research tools, on-page optimization checklists, competitor analysis frameworks, backlink strategies, and more. Perfect for marketers and website owners looking to improve their search rankings.",
    price: 139,
    popular: false,
    image: img5,
    rating: 4.7,
    features: [
      "Keyword research and analysis",
      "On-page optimization tools",
      "Technical SEO audit checklist",
      "Monthly ranking reports"
    ],
    category: "Marketing"
  },
  {
    id: "webinar-package",
    name: "Canva Premium + Themes template Pack",
    description: "2000 Canva Social Media Templates",
    detailDescription: "Host professional, high-converting webinars with our Webinar Success Package. This all-in-one solution includes presentation templates, promotional materials, engagement tools, and follow-up sequences designed to maximize attendance and conversion rates for your online events.",
    price: 249,
    popular: false,
    image: img6,
    rating: 4.6,
    features: [
      "Professional slide templates",
      "Email invitation sequences",
      "Engagement tools and polls",
      "Follow-up and conversion funnels"
    ],
    category: "Business"
  }
];

const featuresData = [
  { text: "20000+ Premium Items", icon: Box },
  { text: "Lifetime Updates", icon: Check },
  { text: "Resell Rights License", icon: Users },
  { text: "Get All Courses & Premium Data Assets in Reasonble Price", icon: Laptop },
];

const whoIsForData = [
  { 
    title: "Digital Marketers", 
    icon: Target,
    description: "Create professional marketing materials without hiring expensive designers."
  },
  { 
    title: "Students", 
    icon: Brain, 
    description: "Build impressive projects and presentations to stand out in your classes."
  },
  { 
    title: "Entrepreneurs", 
    icon: Laptop,
    description: "Launch your business with professional branding on a budget."
  },
];

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
      productData.forEach(product => {
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        });
      });
      
      setIsAdding(false);
      
      toast({
        title: "Success!",
        description: `Bundle added to cart! ${productData.length} items added.`,
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
                Boost Your Business with <span className="gradient-text">Digital Hub</span>  Unbeatable Prices!
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl">
                Create and sell unlimited digital products with our massive bundles of premium assets. 
                All items come with commercial licenses.
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
                    src={homeImg}
                    alt="Bundle Preview" 
                    className="w-full h-auto rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold">Resell Right Bundle</h3>
                    <p className="text-muted-foreground">2000+ premium items with commercial license</p>
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
              products.slice(0, 8).map((product) => (
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
              Our bundle is perfect for a variety of creators and professionals looking to enhance their digital assets.
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
              Get instant access to 2000+ premium items with commercial license and start creating professional digital products today.
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
