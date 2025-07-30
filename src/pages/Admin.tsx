import { useState, useEffect } from 'react';
import { API_BASE } from '@/config/api';
import AdminLogin from '@/components/AdminLogin';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/store/useAuthStore';

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const { isAuthenticated, credentials, logout } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && credentials) {
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, credentials]);

  const checkAuthStatus = async () => {
    if (!credentials) return;
    
    try {
      const response = await fetch(`${API_BASE}/api/admin/status`, {
        headers: {
          'username': credentials.username,
          'password': credentials.password
        }
      });
      const data = await response.json();
      
      if (data.authenticated) {
        fetchProducts();
      } else {
        logout();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    if (!credentials) return;
    
    try {
      const response = await fetch(`${API_BASE}/api/products`, {
        headers: {
          'username': credentials.username,
          'password': credentials.password
        }
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to fetch products');
    }
  };

  const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
    if (!credentials) throw new Error('No credentials');
    
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'username': credentials.username,
        'password': credentials.password,
        ...options.headers,
      },
    });
  };

  const handleLogin = () => {
    setLoading(true);
    checkAuthStatus();
  };

  const handleLogout = () => {
    logout();
    setProducts([]);
    toast.success('Logged out successfully');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      {/* Your admin interface */}
    </div>
  );
};

export default Admin;


