import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  
  const orderId = searchParams.get('orderId');
  const error = searchParams.get('error');

  useEffect(() => {
    // Get order details from localStorage if available
    const pendingOrder = localStorage.getItem('pendingOrder');
    if (pendingOrder) {
      try {
        const orderData = JSON.parse(pendingOrder);
        setOrderDetails(orderData);
      } catch (error) {
        console.error('Error parsing order data:', error);
      }
    }
  }, []);

  const handleRetryPayment = () => {
    // Redirect back to cart to retry payment
    window.location.href = '/cart';
  };

  const getErrorMessage = () => {
    switch (error) {
      case 'order-not-found':
        return 'Order not found. Please try creating a new order.';
      case 'callback-failed':
        return 'Payment verification failed. Please contact support.';
      default:
        return 'Your payment could not be processed. Please try again.';
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="h-20 w-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <XCircle className="h-12 w-12 text-red-600" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4 text-red-600">Payment Failed</h1>
        <p className="text-muted-foreground mb-8">
          {getErrorMessage()}
        </p>

        {orderDetails && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold mb-4">Order Information</h2>
            <div className="space-y-2 mb-4">
              {orderId && <p><strong>Order ID:</strong> {orderId}</p>}
              <p><strong>Customer:</strong> {orderDetails.customerName}</p>
              <p><strong>Email:</strong> {orderDetails.customerEmail}</p>
              <p><strong>Amount:</strong> ₹{orderDetails.totalAmount?.toFixed(2)}</p>
            </div>

            <h3 className="font-medium mb-3">Items in Order:</h3>
            <div className="space-y-2">
              {orderDetails.items?.map((item: any) => (
                <div key={item.id} className="flex justify-between p-3 bg-gray-50 rounded">
                  <span>{item.name}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <h3 className="font-medium text-yellow-800 mb-2">What can you do?</h3>
          <ul className="text-sm text-yellow-700 text-left space-y-1">
            <li>• Check your internet connection and try again</li>
            <li>• Ensure you have sufficient balance in your account</li>
            <li>• Try using a different payment method</li>
            <li>• Contact our support team if the issue persists</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleRetryPayment}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Payment
          </Button>
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
