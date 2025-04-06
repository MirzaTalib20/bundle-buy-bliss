
import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/button';
import CountdownTimer from '@/components/CountdownTimer';
import { Check, Box, Users, ArrowRight, Brain, Target, Laptop } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import NotificationSystem from '@/components/NotificationSystem';

const BUNDLE_ID = "resell-right-bundle";
const BUNDLE_PRICE = 9.99;

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

  const handleAddToCart = () => {
    setIsAdding(true);
    
    setTimeout(() => {
      addItem({
        id: BUNDLE_ID,
        name: "Resell Right Bundle",
        price: BUNDLE_PRICE,
        quantity: 1
      });
      
      setIsAdding(false);
      
      toast.success("Bundle added to cart!", {
        position: "bottom-right",
        autoClose: 2000
      });
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NotificationSystem />
      
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1 space-y-6">
              <div className="inline-block px-4 py-1.5 rounded-full border border-primary/50 bg-primary/10">
                <p className="text-sm font-medium text-primary">Limited Time Offer</p>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                Get <span className="gradient-text">2000+ Premium</span> Digital Items with Resell Rights
              </h1>
              
              <p className="text-lg text-gray-300 max-w-xl">
                Create and sell unlimited digital products with this massive bundle of premium assets. 
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
                  onClick={handleAddToCart}
                  size="lg"
                  className="text-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                  disabled={isAdding}
                >
                  {isAdding ? "Adding..." : "Add to Cart"}
                  {!isAdding && <ArrowRight className="ml-2 h-5 w-5" />}
                </Button>
                
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">${BUNDLE_PRICE}</span>
                    <span className="text-xl text-gray-400 line-through">${(BUNDLE_PRICE * 5).toFixed(2)}</span>
                  </div>
                  <span className="text-green-500 text-sm">Save 80% Today!</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 pt-4">
                <div className="flex gap-2">
                  <img src="https://cdn-icons-png.flaticon.com/512/196/196566.png" alt="Visa" className="h-8" />
                  <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="UPI" className="h-8" />
                  <img src="https://cdn-icons-png.flaticon.com/512/825/825454.png" alt="Razorpay" className="h-8" />
                </div>
                <span className="text-sm text-gray-400">Secure Payment</span>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent rounded-full blur-xl"></div>
                <div className="glass-card rounded-xl overflow-hidden relative z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?q=80&w=2574" 
                    alt="Bundle Preview" 
                    className="w-full h-auto rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold">Resell Right Bundle</h3>
                    <p className="text-gray-300">2000+ premium items with commercial license</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Who Is For Section */}
      <section className="py-16 px-4 bg-muted">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Who Is This <span className="highlight">For?</span></h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Our bundle is perfect for a variety of creators and professionals looking to enhance their digital assets.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whoIsForData.map((item, index) => (
              <div key={index} className="glass-card p-6 rounded-xl">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-30"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Creating?</h2>
            <p className="text-gray-300 mb-8">
              Get instant access to 2000+ premium items with commercial license and start creating professional digital products today.
            </p>
            
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="text-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
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
