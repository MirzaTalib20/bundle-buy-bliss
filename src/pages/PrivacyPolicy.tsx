import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicy = () => {
  // Auto scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Privacy Policy | Digital Hub</title>
      </Helmet>
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-2 text-center">Privacy Policy</h1>
        <h2 className="text-3xl font-bold mb-8 text-center">  THE FLOO CREATIVE MARKETING AGENCY</h2>
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p className="text-sm text-gray-500 mb-6">Last updated: January 2025</p>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when you make a purchase, create an account, 
              or contact us for support.
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Personal information: Name, email address, phone number</li>
              <li>Payment information: Processed securely through Razorpay</li>
              <li>Usage data: How you interact with our website</li>
              <li>Device information: Browser type, IP address, operating system</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Send you digital products via email</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Send important updates about your purchases</li>
              <li>Improve our website and services</li>
              <li>Prevent fraud and ensure security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. Information Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share 
              your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>With payment processors (Razorpay) to complete transactions</li>
              <li>With email service providers to deliver digital products</li>
              <li>When required by law or to protect our rights</li>
              <li>With your explicit consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. All payment information is 
              processed through secure, encrypted connections.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to enhance your browsing experience, analyze 
              website traffic, and understand user preferences.
            </p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Essential cookies for website functionality</li>
              <li>Analytics cookies to improve our services</li>
              <li>You can control cookie settings in your browser</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">6. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide our services, 
              comply with legal obligations, resolve disputes, and enforce our agreements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Data portability where applicable</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">8. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for the 
              privacy practices of these external sites. We encourage you to review their privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">9. Children's Privacy</h2>
            <p>
              Our services are not intended for children under 13 years of age. We do not knowingly 
              collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">10. International Users</h2>
            <p>
              If you are accessing our services from outside India, please note that your information 
              may be transferred to and processed in India where our servers are located.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">11. Changes to Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material 
              changes by posting the new policy on this page with an updated date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">12. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p className="font-semibold">
              Email: digital.districtofficial@gmail.com
            </p>
          </section>
        </div>
      </main>
    </>
  );
};

export default PrivacyPolicy;
