import { useState, useEffect } from 'react';
import { API_BASE } from '@/config/api';
import AdminLogin from '@/components/AdminLogin';
import { toast } from 'react-toastify';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/status`, {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.authenticated) {
        setIsAuthenticated(true);
        fetchProducts();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/products`, {
        credentials: 'include'
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to fetch products');
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    fetchProducts();
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/api/admin/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      setIsAuthenticated(false);
      setProducts([]);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
    return fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  // Rest of your admin component...
  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      {/* Your admin interface */}
    </div>
  );
};

export default Admin;

