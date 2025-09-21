import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

interface OrderDetails {
  orderId: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const { clearCart } = useCartStore();
  
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // Clear cart on successful payment
    clearCart();
    
    // Get order details from localStorage (set during payment initiation)
    const pendingOrder = localStorage.getItem('pendingOrder');
    if (pendingOrder) {
      try {
        const orderData = JSON.parse(pendingOrder);
        setOrderDetails(orderData);
        // Clear the pending order data
        localStorage.removeItem('pendingOrder');
      } catch (error) {
        console.error('Error parsing order data:', error);
      }
    }
  }, [clearCart]);

  const handleDownload = (productId: string, productName: string) => {
    // In a real implementation, this would generate secure download links
    // For now, we'll show a placeholder
    alert(`Download link for ${productName} will be sent to your email shortly.`);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="h-20 w-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4 text-green-600">Payment Successful!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your purchase. Your payment has been processed successfully.
        </p>

        {orderDetails && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <div className="space-y-2 mb-4">
              <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
              <p><strong>Customer:</strong> {orderDetails.customerName}</p>
              <p><strong>Email:</strong> {orderDetails.customerEmail}</p>
              <p><strong>Total Amount:</strong> ₹{orderDetails.totalAmount.toFixed(2)}</p>
            </div>

            <h3 className="font-medium mb-3">Items Purchased:</h3>
            <div className="space-y-3">
              {orderDetails.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity} × ₹{item.price.toFixed(2)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(item.id, item.name)}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h3 className="font-medium text-blue-800 mb-2">What's Next?</h3>
          <ul className="text-sm text-blue-700 text-left space-y-1">
            <li>• You will receive an email confirmation shortly</li>
            <li>• Download links for your digital products are available above</li>
            <li>• Keep your Order ID for future reference</li>
            <li>• Contact support if you need any assistance</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
          <Link to="/track-order">
            <Button variant="outline">
              Track Order
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
