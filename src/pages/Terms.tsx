import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const Terms = () => {
  // Auto scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Terms and Conditions | Digital Hub</title>
      </Helmet>
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8 text-center">Terms and Conditions</h1>
        
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p className="text-sm text-gray-500 mb-6">Last updated: January 2025</p>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Acceptance of Terms</h2>
            <p>
              By accessing and using The Floo Hub's services, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. Digital Products</h2>
            <p>
              We sell digital products including databases, courses, and premium data assets. All products are 
              delivered electronically via email immediately after successful payment confirmation.
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Products include commercial license for resale rights</li>
              <li>Lifetime access to purchased products</li>
              <li>Products are delivered in digital format only</li>
              <li>No physical shipping is involved</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. Payment Terms</h2>
            <p>
              All payments are processed securely through Razorpay. We accept major credit cards, debit cards, 
              and UPI payments. Prices are listed in Indian Rupees (INR).
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Payment is required before product delivery</li>
              <li>All transactions are secure and encrypted</li>
              <li>Prices may change without prior notice</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Refund Policy</h2>
            <p>
              Due to the digital nature of our products, all sales are final. Refunds are only considered in 
              exceptional circumstances such as duplicate purchases or technical issues preventing download.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. License and Usage Rights</h2>
            <p>
              Upon purchase, you receive a commercial license that allows you to:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Use the products for personal and commercial purposes</li>
              <li>Resell the products with appropriate licensing</li>
              <li>Modify and customize the products as needed</li>
              <li>Access lifetime updates when available</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">6. Prohibited Uses</h2>
            <p>You may not use our products for:</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Illegal activities or purposes</li>
              <li>Spamming or unsolicited marketing</li>
              <li>Violating privacy laws or regulations</li>
              <li>Redistributing without proper licensing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">7. Privacy and Data Protection</h2>
            <p>
              We respect your privacy and are committed to protecting your personal information. 
              We collect only necessary information for order processing and product delivery.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">8. Limitation of Liability</h2>
            <p>
              Digital Hub shall not be liable for any indirect, incidental, special, consequential, 
              or punitive damages resulting from your use of our products or services.
            </p>
          </section>

         <section>
  <h2 className="text-2xl font-semibold mb-4 text-gray-900">
    9. Contact Information
  </h2>
  <p>
    For questions about these Terms and Conditions, please contact us at:
  </p>
  <p className="font-semibold">
    THE FLOO CREATIVE MARKETING AGENCY
  </p>
  <p className="font-semibold">
    Email: digital.districtofficial@gmail.com
  </p>
</section>


          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">10. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective immediately 
              upon posting on this page. Your continued use of our services constitutes acceptance of any changes.
            </p>
          </section>
        </div>
      </main>
    </>
  );
};

export default Terms;
