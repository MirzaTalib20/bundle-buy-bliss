
import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/button';
import CountdownTimer from '@/components/CountdownTimer';
import { Check, Box, Users, ArrowRight, Brain, Target, Laptop, Star } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import NotificationSystem from '@/components/NotificationSystem';
import ProductCard from '@/components/ProductCard';
import ReviewSection from '@/components/ReviewSection';
import VideoSection from '@/components/VideoSection';
import ContactForm from '@/components/ContactForm';
import SalesCounter from '@/components/SalesCounter';
import { ProductType } from './ProductDetail';

const BUNDLE_ID = "resell-right-bundle";
const BUNDLE_PRICE = 9.99;

const productData: ProductType[] = [
  {
    id: "resell-right-bundle",
    name: "Resell Right Bundle",
    description: "2000+ premium items with commercial license",
    detailDescription: "The ultimate collection of premium digital assets ready for resale. This comprehensive bundle includes 2000+ items across various categories, all with full commercial rights. Perfect for entrepreneurs, marketers, and content creators looking to expand their digital product inventory without the hassle of creation.",
    price: 9.99,
    popular: true,
    image: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?q=80&w=2574",
    rating: 4.9,
    features: [
      "Commercial license for all items",
      "Ready-to-sell digital products",
      "Lifetime access and updates",
      "Multiple niches covered"
    ],
    category: "Digital Assets"
  },
  {
    id: "marketing-course-pack",
    name: "Marketing Course Pack",
    description: "Complete digital marketing masterclass",
    detailDescription: "Transform your marketing skills with our comprehensive Digital Marketing Masterclass. This all-in-one course pack covers everything from social media strategy to SEO, content marketing, email campaigns, and paid advertising. Perfect for beginners and intermediate marketers looking to sharpen their skills.",
    price: 19.99,
    popular: false,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670",
    rating: 4.8,
    features: [
      "15+ hours of video content",
      "Practical assignments and case studies",
      "Marketing templates and tools",
      "Certificate of completion"
    ],
    category: "Courses"
  },
  {
    id: "ecommerce-toolkit",
    name: "E-commerce Toolkit",
    description: "100+ templates and automation tools",
    detailDescription: "Launch and scale your online store with our E-commerce Toolkit. This comprehensive package includes 100+ customizable templates for product pages, emails, and social media posts, along with powerful automation tools to streamline your operations and boost sales.",
    price: 14.99,
    popular: true,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2574",
    rating: 4.7,
    features: [
      "Shopify and WooCommerce compatible",
      "Email marketing automation sequences",
      "Product page templates",
      "Upsell and cross-sell frameworks"
    ],
    category: "Tools"
  },
  {
    id: "design-assets-bundle",
    name: "Design Assets Bundle",
    description: "500+ premium design elements",
    detailDescription: "Elevate your creative projects with our Design Assets Bundle. Featuring over 500 premium design elements including icons, illustrations, mockups, templates, and more. Perfect for designers, marketers, and content creators looking to enhance their visual content without starting from scratch.",
    price: 12.99,
    popular: false,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2364",
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
    name: "Social Media Content Pack",
    description: "200+ templates for all platforms",
    detailDescription: "Create stunning social media content with our comprehensive Social Media Pack. Featuring 200+ professionally designed templates optimized for Instagram, Facebook, Twitter, LinkedIn, and TikTok. Save time and boost engagement with eye-catching posts that convert followers into customers.",
    price: 11.99,
    popular: true,
    image: "https://images.unsplash.com/photo-1611162618758-b15d2b3ba731?q=80&w=2574",
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
    name: "AI Copywriting Tools",
    description: "Next-gen writing assistant suite",
    detailDescription: "Revolutionize your content creation process with our AI Copywriting Tools. This comprehensive suite of writing assistants helps you craft compelling copy for websites, emails, ads, product descriptions, and more. Powered by advanced language models to ensure high-quality, engaging content every time.",
    price: 24.99,
    popular: true,
    image: "https://images.unsplash.com/photo-1677442135096-ba70ace6553c?q=80&w=2532",
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
    name: "SEO Toolkit Pro",
    description: "Complete search optimization suite",
    detailDescription: "Boost your website's visibility with our complete SEO Toolkit Pro. This comprehensive suite includes keyword research tools, on-page optimization checklists, competitor analysis frameworks, backlink strategies, and more. Perfect for marketers and website owners looking to improve their search rankings.",
    price: 17.99,
    popular: false,
    image: "https://images.unsplash.com/photo-1562577308-9e66f0c65ce5?q=80&w=2574",
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
    name: "Webinar Success Package",
    description: "Complete webinar hosting toolkit",
    detailDescription: "Host professional, high-converting webinars with our Webinar Success Package. This all-in-one solution includes presentation templates, promotional materials, engagement tools, and follow-up sequences designed to maximize attendance and conversion rates for your online events.",
    price: 19.99,
    popular: false,
    image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?q=80&w=2574",
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
  { text: "2000+ Premium Items", icon: Box },
  { text: "Lifetime Updates", icon: Check },
  { text: "Commercial License", icon: Users },
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

  const handleAddToCart = (product) => {
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
                Boost Your Business with <span className="gradient-text">Digital Products</span> – Unbeatable Prices!
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
                  onClick={() => handleAddToCart(productData[0])}
                  size="lg"
                  className="text-lg btn-gradient"
                  disabled={isAdding}
                >
                  {isAdding ? "Adding..." : "Add to Cart"}
                  {!isAdding && <ArrowRight className="ml-2 h-5 w-5" />}
                </Button>
                
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">${BUNDLE_PRICE}</span>
                    <span className="text-xl text-muted-foreground line-through">${(BUNDLE_PRICE * 5).toFixed(2)}</span>
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
                    src="https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?q=80&w=2574" 
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
      <section className="section-padding bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured <span className="highlight">Products</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our most popular digital products designed to help you grow your business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {productData.slice(0, 8).map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
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
              onClick={() => handleAddToCart(productData[0])}
              size="lg"
              className="text-lg btn-gradient"
            >
              Get Started Now - Just ${BUNDLE_PRICE}
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
