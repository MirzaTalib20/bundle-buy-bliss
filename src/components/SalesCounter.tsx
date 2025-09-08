
import { useEffect, useState } from 'react';
import { TrendingUp, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const SalesCounter = () => {
  const [salesCount, setSalesCount] = useState(137);
  
  useEffect(() => {
    // Simulate increasing sales count randomly every 30-60 seconds
    const interval = setInterval(() => {
      setSalesCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, Math.random() * 30000 + 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className="py-8 bg-gradient-to-r from-primary/10 to-secondary/10">
      <div className="container mx-auto">
        <motion.div 
          className="glass-card rounded-xl p-6 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-lg">Today's Sales</p>
              <p className="text-muted-foreground">Updated just now</p>
            </div>
          </div>
          
          <div className="h-12 hidden md:block border-r border-border"></div>
          
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold">{salesCount}</p>
              <p className="text-muted-foreground"> Sold Today</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SalesCounter;
