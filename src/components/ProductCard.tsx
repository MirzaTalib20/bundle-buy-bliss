
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    popular?: boolean;
  };
  onAddToCart: () => void;
}

const ProductCard = ({ product, onAddToCart }: ProductProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div 
      className="glass-card rounded-xl overflow-hidden card-hover"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="relative">
        <div className="aspect-video bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
          <ShoppingCart className="h-12 w-12 text-primary/50" />
        </div>
        
        {product.popular && (
          <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
            Popular
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{product.name}</h3>
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500 mr-1" />
            <span className="text-sm font-medium">4.9</span>
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
          <Button 
            onClick={onAddToCart}
            variant="outline" 
            size="sm"
            className="border-primary text-primary hover:bg-primary hover:text-white transition-colors"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
