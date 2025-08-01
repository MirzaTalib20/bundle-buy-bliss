
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
  { name: 'Aarav', location: 'Mumbai', product: 'Resell Right Bundle', time: '2 minutes ago' },
  { name: 'Diya', location: 'Delhi', product: 'Marketing Course Pack', time: '5 minutes ago' },
  { name: 'Vivaan', location: 'Bangalore', product: 'E-commerce Toolkit', time: '7 minutes ago' },
  { name: 'Ananya', location: 'Hyderabad', product: 'Design Assets Bundle', time: '10 minutes ago' },
  { name: 'Krishna', location: 'Ahmedabad', product: 'Resell Right Bundle', time: '15 minutes ago' },
  { name: 'Meera', location: 'Chennai', product: 'Marketing Course Pack', time: '20 minutes ago' },
  { name: 'Arjun', location: 'Pune', product: 'E-commerce Toolkit', time: '25 minutes ago' },
  { name: 'Isha', location: 'Kolkata', product: 'Design Assets Bundle', time: '30 minutes ago' },
  { name: 'Ritika', location: 'Jaipur', product: 'Instagram Reels Templates', time: '32 minutes ago' },
  { name: 'Yash', location: 'Lucknow', product: 'Digital Marketing Starter Kit', time: '35 minutes ago' },
  { name: 'Sanya', location: 'Surat', product: 'Freelancer Toolkit', time: '40 minutes ago' },
  { name: 'Dev', location: 'Nagpur', product: 'Startup Launch Bundle', time: '45 minutes ago' },
  { name: 'Nisha', location: 'Bhopal', product: 'WhatsApp Business Templates', time: '48 minutes ago' },
  { name: 'Kabir', location: 'Thane', product: 'Instagram Ad Kit', time: '50 minutes ago' },
  { name: 'Pooja', location: 'Patna', product: 'Resell Rights Digital Products', time: '55 minutes ago' },
  { name: 'Raghav', location: 'Indore', product: 'Small Business Branding Kit', time: '1 hour ago' },
  { name: 'Tanya', location: 'Kanpur', product: 'Digital Coaching Toolkit', time: '1 hour ago' },
  { name: 'Aditya', location: 'Ludhiana', product: 'Canva Templates for Creators', time: '1 hour ago' },
  { name: 'Sneha', location: 'Vadodara', product: 'Course Creator Bundle', time: '2 hours ago' },
  { name: 'Karan', location: 'Nashik', product: 'Social Media Calendar Pack', time: '2 hours ago' },
  { name: 'Neha', location: 'Varanasi', product: 'Client Proposal Templates', time: '3 hours ago' },
  { name: 'Manav', location: 'Amritsar', product: 'Local Business Kit', time: '4 hours ago' },
  { name: 'Juhi', location: 'Rajkot', product: 'Content Planning System', time: '5 hours ago' },
  { name: 'Rahul', location: 'Visakhapatnam', product: 'Affiliate Marketing Toolkit', time: '6 hours ago' },
  { name: 'Lakshmi', location: 'Coimbatore', product: 'Online Business Starter Pack', time: '7 hours ago' },
  { name: 'Imran', location: 'Meerut', product: 'Copywriting Templates Bundle', time: '8 hours ago' },
  { name: 'Sonal', location: 'Guwahati', product: 'Lead Magnet Bundle', time: '9 hours ago' },
  { name: 'Ayaan', location: 'Ranchi', product: 'Digital Business Blueprint', time: '10 hours ago' }
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
  let timeoutId: NodeJS.Timeout;

  const showRandomNotification = () => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * notifications.length);
    } while (randomIndex === lastNotificationIndex && notifications.length > 1);

    setLastNotificationIndex(randomIndex);

    const notification = notifications[randomIndex];

    toast.dismiss(); // Remove existing toast before showing new

    toast(
      <PurchaseToast
        name={notification.name}
        location={notification.location}
        product={notification.product}
      />,
      {
        position: "bottom-left",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: "glass-card",
      }
    );

    // ⏱ Slow down: 2 to 4 minutes (120000ms to 240000ms)
    const nextDelay = Math.random() * 120000 + 120000;

    timeoutId = setTimeout(showRandomNotification, nextDelay);
  };

  // Start first toast after 15 seconds (adjust as needed)
  timeoutId = setTimeout(showRandomNotification, 15000);

  return () => {
    clearTimeout(timeoutId);
  };
}, [notifications]); // ✅ Watch `notifications`, not `lastNotificationIndex`

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
