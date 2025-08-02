import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  function gtag(...args: any[]): void;
}

const Analytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page views on route changes
    gtag('config', 'G-B6XCP35EWM', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: location.pathname,
    });
  }, [location]);

  // Track custom events
  const trackEvent = (action: string, category: string, label?: string) => {
    gtag('event', action, {
      event_category: category,
      event_label: label,
    });
  };

  // Make tracking functions available globally
  useEffect(() => {
    (window as any).trackEvent = trackEvent;
  }, []);

  return null;
};

export default Analytics;