
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ShoppingBag, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type Notification = {
  name: string;
  location: string;
  product: string;
  time: string;
};

const notifications: Notification[] = [
  { name: 'John', location: 'New York', product: 'Resell Right Bundle', time: '2 minutes ago' },
  { name: 'Emma', location: 'London', product: 'Marketing Course Pack', time: '5 minutes ago' },
  { name: 'Michael', location: 'Toronto', product: 'E-commerce Toolkit', time: '7 minutes ago' },
  { name: 'Sophia', location: 'Sydney', product: 'Design Assets Bundle', time: '10 minutes ago' },
  { name: 'David', location: 'Berlin', product: 'Resell Right Bundle', time: '15 minutes ago' },
  { name: 'Olivia', location: 'Paris', product: 'Marketing Course Pack', time: '20 minutes ago' },
  { name: 'James', location: 'Tokyo', product: 'E-commerce Toolkit', time: '25 minutes ago' },
  { name: 'Isabella', location: 'Rome', product: 'Design Assets Bundle', time: '30 minutes ago' },
];

const NotificationSystem = () => {
  const [lastNotificationIndex, setLastNotificationIndex] = useState(-1);

  // Custom toast component with animation
  const PurchaseToast = ({ name, location, product }: { name: string; location: string; product: string }) => (
    <div className="flex items-center gap-3 text-sm font-medium">
      <div className={cn(
        "h-10 w-10 rounded-full flex items-center justify-center",
        "bg-gradient-to-br from-primary/30 to-secondary/30"
      )}>
        <ShoppingBag className="h-5 w-5 text-primary-foreground" />
      </div>
      <div>
        <p><span className="font-semibold">{name}</span> from <span className="font-semibold">{location}</span></p>
        <p className="text-muted-foreground text-xs">just purchased {product}!</p>
      </div>
      <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
    </div>
  );

  useEffect(() => {
    const showRandomNotification = () => {
      // Get a random notification that is different from the last one
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * notifications.length);
      } while (randomIndex === lastNotificationIndex && notifications.length > 1);

      setLastNotificationIndex(randomIndex);
      
      const notification = notifications[randomIndex];
      
      toast(<PurchaseToast name={notification.name} location={notification.location} product={notification.product} />, {
        position: "bottom-left",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: "glass-card",
      });
    };

    // Show first notification after a delay
    const initialTimeout = setTimeout(() => {
      showRandomNotification();
    }, 3000);

    // Set interval for recurring notifications (5-10 seconds)
    const interval = setInterval(() => {
      showRandomNotification();
    }, Math.random() * 5000 + 5000); // Random interval between 5-10 seconds

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [lastNotificationIndex]);

  return (
    <ToastContainer
      position="bottom-left"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
};

export default NotificationSystem;
