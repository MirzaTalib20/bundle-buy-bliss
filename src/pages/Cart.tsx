
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Trash, AlertCircle, CheckCircle, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '@/config/api';

const Cart = () => {
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart } = useCartStore();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    isSubmitting: false,
    isSubmitted: false,
    error: '',
  });

  // Auto scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleQuantityChange = (itemId: string, value: string) => {
    const quantity = parseInt(value);
    if (quantity > 0) {
      updateQuantity(itemId, quantity);
    }
  };

  const handleQuantityIncrease = (itemId: string, currentQuantity: number) => {
    updateQuantity(itemId, currentQuantity + 1);
  };

  const handleQuantityDecrease = (itemId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(itemId, currentQuantity - 1);
    }
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formState.name.trim() || !formState.email.trim()) {
    setFormState((prev) => ({
      ...prev,
      error: 'Please fill in all fields',
    }));
    return;
  }

  if (!formState.email.includes('@')) {
    setFormState((prev) => ({
      ...prev,
      error: 'Please enter a valid email address',
    }));
    return;
  }

  setFormState((prev) => ({
    ...prev,
    isSubmitting: true,
    error: '',
  }));

  try {
    // Create order with PhonePe
    const response = await fetch(`${API_BASE}/api/phonepe/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: formState.name,
        customerEmail: formState.email,
        customerPhone: '9999999999', // You can add a phone field to the form
        orderItems: items,
        totalAmount: totalPrice,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Order creation failed');
    }

    // Store order info in localStorage for success page
    localStorage.setItem('pendingOrder', JSON.stringify({
      orderId: data.orderId,
      merchantTransactionId: data.merchantTransactionId,
      customerName: formState.name,
      customerEmail: formState.email,
      totalAmount: totalPrice,
      items: items
    }));

    // Redirect to PhonePe payment page
    window.location.href = data.paymentUrl;

  } catch (error) {
    console.error('Payment initiation error:', error);
    setFormState((prev) => ({
      ...prev,
      isSubmitting: false,
      error: error instanceof Error ? error.message : 'Payment failed. Please try again.',
    }));
  }
};


  if (formState.isSubmitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="h-16 w-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Thank you for your purchase!</h1>
          <p className="text-muted-foreground mb-6">Your order has been received and is being processed. You will receive an email with your purchase details shortly.</p>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Link to="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 md:py-12 px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="flex-1">
          <div className="glass-card rounded-lg p-4 md:p-6 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-4 py-4 border-b border-border last:border-0">
                <div className="h-20 w-20 sm:h-20 sm:w-20 bg-muted rounded-md flex items-center justify-center overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ShoppingCart className="h-10 w-10 sm:h-10 sm:w-10 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-center text-center sm:text-left">
                  <h3 className="font-medium text-sm sm:text-base">{item.name}</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">₹{item.price.toFixed(2)} per item</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-muted"
                      onClick={() => handleQuantityDecrease(item.id, item.quantity)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input 
                      type="number" 
                      min="1"
                      className="w-16 text-center border-0 focus-visible:ring-0 h-8"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-muted"
                      onClick={() => handleQuantityIncrease(item.id, item.quantity)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="min-w-20 text-right">
                    <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {totalItems > 5 && (
                <Button 
                  variant="destructive" 
                  onClick={clearCart}
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <Trash className="h-4 w-4" />
                  Clear All
                </Button>
              )}
              
              <div className="text-center sm:text-right">
                <p className="text-lg">
                  Total: <span className="font-bold">₹{totalPrice.toFixed(2)}</span>
                </p>
                <p className="text-sm text-muted-foreground">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:w-1/3">
          <div className="glass-card rounded-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold mb-4">Checkout</h2>
            
            {formState.error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 mb-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{formState.error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Name
                  </label>
                  <Input
                    id="name"
                    value={formState.name}
                    onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your full name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full btn-gradient"
                    disabled={formState.isSubmitting}
                  >
                    {formState.isSubmitting ? 'Processing...' : 'Complete Purchase'}
                  </Button>
                </div>
                
                <div className="flex justify-center gap-2 pt-2">
                  <img src="https://cdn-icons-png.flaticon.com/512/196/196566.png" alt="Visa" className="h-6 sm:h-8" />
                  <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="UPI" className="h-6 sm:h-8" />
                  <img src="data:image/png;base64,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" alt="PhonePe" className="h-6 sm:h-8" />
                  <img src="https://cdn-icons-png.flaticon.com/512/825/825454.png" alt="Digital Payments" className="h-6 sm:h-8" />
                </div>
                <p className="text-center text-xs text-muted-foreground">Secure payments powered by PhonePe</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
