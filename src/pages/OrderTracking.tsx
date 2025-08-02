import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Package, Download } from 'lucide-react';

interface OrderStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'delivered';
  items: Array<{ name: string; downloadUrl?: string }>;
  createdAt: Date;
  totalAmount: number;
}

const OrderTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const trackOrder = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setOrderStatus({
        id: orderId,
        status: 'completed',
        items: [
          { name: 'Digital Marketing Bundle', downloadUrl: 'https://example.com/download1' },
          { name: 'Premium Templates Pack', downloadUrl: 'https://example.com/download2' }
        ],
        createdAt: new Date(),
        totalAmount: 499
      });
      setLoading(false);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing': return <Package className="h-5 w-5 text-blue-500" />;
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Track Your Order</h1>
      
      <div className="max-w-md mb-8">
        <div className="flex gap-2">
          <Input
            placeholder="Enter Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
          <Button onClick={trackOrder} disabled={loading}>
            {loading ? 'Tracking...' : 'Track'}
          </Button>
        </div>
      </div>

      {orderStatus && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            {getStatusIcon(orderStatus.status)}
            <div>
              <h2 className="text-xl font-semibold">Order #{orderStatus.id}</h2>
              <Badge variant={orderStatus.status === 'completed' ? 'default' : 'secondary'}>
                {orderStatus.status.toUpperCase()}
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Order Items:</h3>
              {orderStatus.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span>{item.name}</span>
                  {item.downloadUrl && (
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-semibold">₹{orderStatus.totalAmount}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Order Date:</span>
                <span>{orderStatus.createdAt.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;