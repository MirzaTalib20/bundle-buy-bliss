
import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import logo from '@/assest/img/logo.png';

const Navbar = () => {
  const { totalItems } = useCartStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setIsMobileMenuOpen(false); // Close mobile menu after search
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/95 border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        {/* Mobile Layout */}
        <div className="flex md:hidden justify-between items-center">
          <Link to="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold"><img src={logo} className="w-full h-full object-cover rounded-full" /></span>
            </div>
            <span className="text-lg font-semibold">The Floo Hub Products</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-primary text-white text-xs rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="h-8 w-8"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            {/* Mobile Search Bar */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 w-full"
                />
              </div>
            </form>

            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="hover:text-primary transition-colors text-base py-2"
                onClick={closeMobileMenu}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="hover:text-primary transition-colors text-base py-2"
                onClick={closeMobileMenu}
              >
                Products
              </Link>
            </div>
          </div>
        )}

        {/* Desktop Layout */}
        <div className="hidden md:flex justify-between items-center gap-4">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold"><img src={logo} className="w-full h-full object-cover rounded-full" /></span>
            </div>
            <span className="text-xl font-semibold">The Floo Hub Products</span>
          </Link>
          
          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
          </form>
          
          <div className="flex items-center gap-6 flex-shrink-0">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
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
      </div>
    </nav>
  );
};

export default Navbar;
