
import { useCartStore } from '@/store/useCartStore';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '@/assest/img/logo.png';
const Navbar = () => {
  const { totalItems } = useCartStore();
  
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/95 border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
            <span className="text-white font-bold"><img src={logo} /></span>
          </div>
          <span className="text-xl font-semibold">Digital Hub</span>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/cart" className="relative">
            <ShoppingCart className="h-6 w-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-primary text-white text-xs rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
