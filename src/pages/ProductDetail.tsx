
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowLeft, Star, Image, Check, Award } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';

export interface ProductType {
  id: string;
  name: string;
  description: string;
  price: number;
  popular?: boolean;
  image?: string;
  rating?: number;
  detailDescription?: string;
  features?: string[];
  category?: string;
  url?:string;
}

// We'll access this from the parent component
const productsData: ProductType[] = [
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
    category: "Digital Assets",
    url:""
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

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);
  
  // Find the product based on the ID from URL params
  const product = productsData.find(p => p.id === id);
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
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
  
  if (!product) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <p className="mb-6">The product you are looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
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
          {productsData
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
