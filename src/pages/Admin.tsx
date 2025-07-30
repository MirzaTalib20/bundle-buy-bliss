import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X, LogOut } from 'lucide-react';
import { toast } from 'react-toastify';
import AdminLogin from '@/components/AdminLogin';
import { API_BASE } from '@/config/api';

interface Product {
  _id?: string;
  id: string;
  name: string;
  description: string;
  detailDescription: string;
  price: number;
  popular: boolean;
  image: string;
  rating: number;
  features: string[];
  category: string;
  url: string;
}

const Admin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const emptyProduct: Product = {
    id: '',
    name: '',
    description: '',
    detailDescription: '',
    price: 0,
    popular: false,
    image: '',
    rating: 4.5,
    features: [],
    category: '',
    url: ''
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
      fetchProducts(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProducts = async (authToken?: string) => {
    try {
      const headers: HeadersInit = {};
      if (authToken || token) {
        headers.Authorization = `Bearer ${authToken || token}`;
      }
      
      const response = await fetch(`${API_BASE}/api/products`, { headers });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (newToken: string) => {
    setToken(newToken);
    setIsAuthenticated(true);
    fetchProducts(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setIsAuthenticated(false);
    setProducts([]);
  };

  const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return fetch(url, {
      ...options,
      headers,
    });
  };

  const handleSave = async (product: Product) => {
    try {
      const method = product._id ? 'PUT' : 'POST';
      const url = product._id ? `${API_BASE}/api/products/${product.id}` : `${API_BASE}/api/products`;
      
      const response = await makeAuthenticatedRequest(url, {
        method,
        body: JSON.stringify(product),
      });

      if (response.ok) {
        toast.success(`Product ${product._id ? 'updated' : 'created'} successfully`);
        fetchProducts();
        setEditingProduct(null);
        setIsCreating(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save product');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save product');
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await makeAuthenticatedRequest(`${API_BASE}/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Product deleted successfully');
        fetchProducts();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete product');
    }
  };

  const ProductForm = ({ product, onSave, onCancel }: {
    product: Product;
    onSave: (product: Product) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState(product);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{product._id ? 'Edit Product' : 'Create New Product'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Product ID"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                required
              />
              <Input
                placeholder="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <Textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
            
            <Textarea
              placeholder="Detailed Description"
              value={formData.detailDescription}
              onChange={(e) => setFormData({ ...formData, detailDescription: e.target.value })}
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
              />
              <Input
                type="number"
                step="0.1"
                placeholder="Rating"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                required
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="border rounded px-3 py-2"
                required
              >
                <option value="">Select Category</option>
                <option value="Digital Assets">Digital Assets</option>
                <option value="Web Design">Web Design</option>
                <option value="Design Assets">Design Assets</option>
                <option value="Courses">Courses</option>
                <option value="YouTube">YouTube</option>
                <option value="Print on Demand">Print on Demand</option>
                <option value="Templates">Templates</option>
              </select>
            </div>
            
            <Input
              placeholder="Image URL"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              required
            />
            
            <Input
              placeholder="Product URL"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
            
            <Textarea
              placeholder="Features (one per line)"
              value={formData.features.join('\n')}
              onChange={(e) => setFormData({ ...formData, features: e.target.value.split('\n').filter(f => f.trim()) })}
            />
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.popular}
                onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
              />
              <label>Popular Product</label>
            </div>
            
            <div className="flex gap-2">
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Admin Panel | Digital Hub</title>
      </Helmet>
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Product Management</h1>
          <div className="flex gap-2">
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {(isCreating || editingProduct) && (
          <ProductForm
            product={editingProduct || emptyProduct}
            onSave={handleSave}
            onCancel={() => {
              setIsCreating(false);
              setEditingProduct(null);
            }}
          />
        )}

        <div className="grid gap-4">
          {products.map((product) => (
            <Card key={product._id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{product.name}</h3>
                      {product.popular && <Badge>Popular</Badge>}
                    </div>
                    <p className="text-gray-600 mb-2">{product.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>₹{product.price}</span>
                      <span>Rating: {product.rating}</span>
                      <span>Category: {product.category}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingProduct(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default Admin;

