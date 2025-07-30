import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Grid, List } from 'lucide-react';
import { motion } from 'framer-motion';
import  ProductCard  from '@/components/ProductCard';

// Import product data from Index page
import img from "@/assest/img/pan.jpg";
import img1 from "@/assest/img/themes.jpg";
import img2 from "@/assest/img/adboe.jpg";
import img3 from "@/assest/img/digital.jpg";
import img4 from "@/assest/img/youtube.jpg";
import img5 from "@/assest/img/premiumtshirt.png";
import img6 from "@/assest/img/canva.png";

interface ProductType {
  id: string;
  name: string;
  description: string;
  detailDescription: string;
  price: number;
  popular?: boolean;
  image: string;
  rating: number;
  features: string[];
  category: string;
  url: string;
}

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
    url: "https://turbopayz.com/view-product/XGtB7JE1ZrmqV6C71gMwi8v0"
  },
  {
    id: "premium-themes-bundle",
    name: "Premium Themes Bundle",
    description: "1000+ professional website themes",
    detailDescription: "Transform your web presence with our Premium Themes Bundle featuring over 1000 professionally designed website themes for WordPress, HTML, and other platforms.",
    price: 149,
    popular: true,
    image: img1,
    rating: 4.8,
    features: [
      "WordPress & HTML themes",
      "Mobile responsive designs",
      "SEO optimized",
      "Regular updates"
    ],
    category: "Web Design",
    url: ""
  },
  {
    id: "adobe-creative-suite",
    name: "Adobe Creative Suite Assets",
    description: "Premium design assets for Adobe products",
    detailDescription: "Enhance your creative projects with our comprehensive collection of Adobe Creative Suite assets including templates, brushes, actions, and more.",
    price: 179,
    popular: false,
    image: img2,
    rating: 4.7,
    features: [
      "Photoshop templates",
      "Illustrator vectors",
      "After Effects projects",
      "Commercial license"
    ],
    category: "Design Assets",
    url: ""
  },
  {
    id: "digital-marketing-course",
    name: "Digital Marketing Masterclass",
    description: "Complete digital marketing course bundle",
    detailDescription: "Master digital marketing with our comprehensive course covering SEO, social media, PPC, email marketing, and more.",
    price: 299,
    popular: true,
    image: img3,
    rating: 4.9,
    features: [
      "20+ hours of content",
      "Practical assignments",
      "Certificate included",
      "Lifetime access"
    ],
    category: "Courses",
    url: ""
  },
  {
    id: "youtube-growth-pack",
    name: "YouTube Growth Pack",
    description: "Complete YouTube channel growth toolkit",
    detailDescription: "Grow your YouTube channel with our comprehensive toolkit including thumbnails, intro/outro templates, and growth strategies.",
    price: 129,
    popular: false,
    image: img4,
    rating: 4.6,
    features: [
      "Thumbnail templates",
      "Intro/outro videos",
      "Growth strategies",
      "Analytics tools"
    ],
    category: "YouTube",
    url: ""
  },
  {
    id: "premium-tshirt-designs",
    name: "Premium T-Shirt Designs",
    description: "500+ ready-to-print t-shirt designs",
    detailDescription: "Start your print-on-demand business with our collection of 500+ premium t-shirt designs across various niches.",
    price: 99,
    popular: false,
    image: img5,
    rating: 4.5,
    features: [
      "High-resolution designs",
      "Multiple formats",
      "Commercial license",
      "Trending niches"
    ],
    category: "Print on Demand",
    url: ""
  },
  {
    id: "canva-templates-bundle",
    name: "Canva Templates Bundle",
    description: "1000+ professional Canva templates",
    detailDescription: "Create stunning designs with our massive collection of Canva templates for social media, presentations, and marketing materials.",
    price: 89,
    popular: true,
    image: img6,
    rating: 4.8,
    features: [
      "Social media templates",
      "Business presentations",
      "Marketing materials",
      "Easy customization"
    ],
    category: "Templates",
    url: ""
  }
];

const categories = ["All", "Digital Assets", "Web Design", "Design Assets", "Courses", "YouTube", "Print on Demand", "Templates"];

const Products = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Fallback to static data
      setProducts(productData);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "popular":
        default:
          return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      }
    });

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading products...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Products | Digital Hub - Premium Digital Assets</title>
        <meta name="description" content="Browse our collection of premium digital products including databases, courses, themes, and design assets with commercial licenses." />
      </Helmet>
      
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our <span className="highlight">Products</span></h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our comprehensive collection of premium digital products designed to help you grow your business and enhance your creative projects.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-sm"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Sort and View Options */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded px-3 py-1 text-sm"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 ${
          viewMode === "grid" 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-1"
        }`}>
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters
            </p>
            <Button onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
            }}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Results Count */}
        <div className="text-center mt-8 text-muted-foreground">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>
    </>
  );
};

export default Products;
