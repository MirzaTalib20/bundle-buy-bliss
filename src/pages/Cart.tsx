
import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Trash, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
    // Replace this with your backend API endpoint
    const response = await fetch('https://razor-pay-api.vercel.app/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: totalPrice,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
      }),
    });

    const data = await response.json();

    if (!data.success) throw new Error('Order creation failed');

    const options = {
      key: 'rzp_test_LL7ncusi9JDDJm', // DO NOT USE SECRET KEY HERE
      amount: data.order.amount,
      currency: data.order.currency,
      name: 'Your Store Name',
      description: 'Thank you for shopping with us!',
      image: '/your-logo.png',
      order_id: data.order.id,
      handler: function (response: any) {
        setFormState({
          name: '',
          email: '',
          isSubmitting: false,
          isSubmitted: true,
          error: '',
        });
        clearCart();
        // Scroll to top after successful payment
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      prefill: {
        name: formState.name,
        email: formState.email,
      },
      notes: {
        cartItems: JSON.stringify(items),
      },
      theme: {
        color: '#6366f1',
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error(error);
    setFormState((prev) => ({
      ...prev,
      isSubmitting: false,
      error: 'Payment failed. Please try again.',
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
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="glass-card rounded-lg p-6 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-4 py-4 border-b border-border last:border-0">
                <div className="h-20 w-20 bg-muted rounded-md flex items-center justify-center overflow-hidden">
  {item.image ? (
    <img 
      src={item.image} 
      alt={item.name} 
      className="h-full w-full object-cover"
    />
  ) : (
    <ShoppingCart className="h-10 w-10 text-muted-foreground" />
  )}
</div>

                
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-muted-foreground text-sm">${item.price.toFixed(2)} per item</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <Input 
                      type="number" 
                      min="1"
                      className="w-16 text-center"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    />
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
          
          <div className="flex justify-between items-center">
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
            
            {totalItems > 5 && (
              <Button 
                variant="destructive" 
                onClick={clearCart}
                className="flex items-center gap-2"
              >
                <Trash className="h-4 w-4" />
                Clear All
              </Button>
            )}
            
            <div className="text-right">
              <p className="text-lg">
                Total: <span className="font-bold">₹{totalPrice.toFixed(2)}</span>
              </p>
              <p className="text-sm text-muted-foreground">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
        
        <div className="lg:w-1/3">
          <div className="glass-card rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Checkout</h2>
            
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
                  <img src="https://cdn-icons-png.flaticon.com/512/196/196566.png" alt="Visa" className="h-8" />
                  <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="UPI" className="h-8" />
                  <img src="https://cdn-icons-png.flaticon.com/512/825/825454.png" alt="Razorpay" className="h-8" />
                </div>
                <p className="text-center text-xs text-muted-foreground">All payments are secure and encrypted</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
