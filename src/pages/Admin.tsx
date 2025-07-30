import { useState, useEffect } from 'react';
import { API_BASE } from '@/config/api';
import AdminLogin from '@/components/AdminLogin';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash2, Edit, Plus, LogOut } from 'lucide-react';

const Admin = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    id: '',
    name: '',
    price: '',
    description: '',
    image: '',
    category: ''
  });
  const { isAuthenticated, credentials, logout } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && credentials) {
      fetchProducts();
    }
  }, [isAuthenticated, credentials]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/products/public`);
      
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        toast.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Fetch products error:', error);
      toast.error('Failed to fetch products');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!credentials) return;

    try {
      const response = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'username': credentials.username,
          'password': credentials.password
        },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price)
        })
      });

      if (response.ok) {
        toast.success('Product added successfully');
        setNewProduct({ id: '', name: '', price: '', description: '', image: '', category: '' });
        setShowAddForm(false);
        fetchProducts(); // Refresh the products list
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Add product error:', error);
      toast.error('Error adding product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!credentials || !confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`${API_BASE}/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'username': credentials.username,
          'password': credentials.password
        }
      });

      if (response.ok) {
        toast.success('Product deleted successfully');
        fetchProducts(); // Refresh the products list
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Delete product error:', error);
      toast.error('Error deleting product');
    }
  };

  const handleLogin = () => {
    // This will trigger the useEffect to fetch products
    console.log('Login successful, fetching products...');
  };

  const handleLogout = () => {
    logout();
    setProducts([]);
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Add Product Button */}
        <div className="mb-6">
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="h-4 w-4 mr-2" />
            {showAddForm ? 'Cancel' : 'Add New Product'}
          </Button>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Product ID</label>
                    <Input
                      value={newProduct.id}
                      onChange={(e) => setNewProduct({...newProduct, id: e.target.value})}
                      placeholder="unique-product-id"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <Input
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      placeholder="Product Name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      placeholder="29.99"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <Input
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      placeholder="Category"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    placeholder="Product description..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <Input
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Add Product</Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Products List */}
        <Card>
          <CardHeader>
            <CardTitle>Products ({products.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No products found. Add your first product above.
              </p>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                      <p className="text-sm font-medium">₹{product.price}</p>
                      <p className="text-xs text-muted-foreground">ID: {product.id}</p>
                      {product.category && (
                        <p className="text-xs text-blue-600">Category: {product.category}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;







