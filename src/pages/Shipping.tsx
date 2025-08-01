import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const Shipping = () => {
  // Auto scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Shipping Policy | YourWebsiteName</title>
      </Helmet>
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8 text-center">Shipping Policy</h1>
        
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p>
            As a digital product store, we deliver all our products electronically via email. 
            There are no physical items to ship, which means you can access your purchases 
            almost immediately after completing your payment.
          </p>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Digital Delivery Details:</h2>
            <ul className="space-y-3 list-disc list-inside">
              <li>
                <strong>Delivery Time:</strong> Digital products are typically delivered within 
                5-30 minutes after successful payment confirmation.
              </li>
              <li>
                <strong>Email Accuracy:</strong> Please ensure your email address is correct during 
                checkout, as this is where your digital products will be sent.
              </li>
              <li>
                <strong>Check Your Spam Folder:</strong> If you don't receive your purchase within 
                30 minutes, please check your spam/junk folder as automated emails sometimes 
                end up there.
              </li>
              <li>
                <strong>Support Contact:</strong> If you still haven't received your digital 
                products after checking spam, please contact us at{' '}
                <a href="mailto:digital.districtofficial@gmail.com" className="text-primary hover:underline">
                  digital.districtofficial@gmail.com
                </a>{' '}
                with your order details.
              </li>
            </ul>
          </div>

          <p>
            For any questions regarding our digital delivery process or if you need assistance 
            with accessing your purchased products, please don't hesitate to reach out to our 
            support team at{' '}
            <a href="mailto:digital.districtofficial@gmail.com" className="text-primary hover:underline">
              digital.districtofficial@gmail.com
            </a>. 
            We're here to help ensure you receive your digital products promptly.
          </p>
        </div>
      </main>
    </>
  );
};

export default Shipping;




