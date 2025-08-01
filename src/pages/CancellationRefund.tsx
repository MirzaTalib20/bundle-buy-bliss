import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { AlertCircle, Clock, Mail, CheckCircle, XCircle } from 'lucide-react';

const CancellationRefund = () => {
  // Auto scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Cancellation & Refund Policy | Digital Hub</title>
        <meta name="description" content="Learn about our cancellation and refund policy for digital products. Understand the terms and conditions for refunds and cancellations." />
      </Helmet>
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Cancellation & Refund Policy</h1>
          <p className="text-muted-foreground text-lg">
            Important information about cancellations and refunds for digital products
          </p>
        </div>

        <div className="space-y-8">
          {/* Policy Overview */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-xl font-semibold text-amber-800 mb-2">Important Notice</h2>
                <p className="text-amber-700">
                  Due to the digital nature of our products, all sales are final once the order is completed 
                  and the digital files have been delivered to your email address.
                </p>
              </div>
            </div>
          </div>

          {/* No Refund Policy */}
          <section className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="h-6 w-6 text-red-500" />
              <h2 className="text-2xl font-semibold">No Refund Policy</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                As we sell digital products that are delivered instantly via email, we do not offer 
                cancellations or refunds once the order is completed. This policy is in place because:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Digital products cannot be "returned" once downloaded</li>
                <li>Instant delivery means the product is immediately accessible</li>
                <li>All products come with commercial licenses that activate upon purchase</li>
                <li>Files are delivered automatically and cannot be "recalled"</li>
              </ul>
            </div>
          </section>

          {/* Exceptions */}
          <section className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <h2 className="text-2xl font-semibold">Limited Exceptions</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                Refunds may be considered only in the following exceptional circumstances:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Duplicate Purchase</h3>
                  <p className="text-green-700 text-sm">
                    Accidental repeat orders of the same product within 24 hours
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Technical Issues</h3>
                  <p className="text-blue-700 text-sm">
                    Proven technical problems preventing download with valid proof
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* What We Don't Refund */}
          <section className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="h-6 w-6 text-red-500" />
              <h2 className="text-2xl font-semibold">What We Don't Refund</h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Buyer's remorse or change of mind</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Mistaken purchases or wrong product selection</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Compatibility issues with your software or system</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Dissatisfaction with product quality or content</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p>Products downloaded or accessed after purchase</p>
              </div>
            </div>
          </section>

          {/* Refund Process */}
          <section className="bg-white rounded-lg border p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-6 w-6 text-blue-500" />
              <h2 className="text-2xl font-semibold">Refund Request Process</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                If you believe your situation qualifies for an exception, please follow these steps:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    1
                  </div>
                  <p>Contact us within <strong>48 hours</strong> of your purchase</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    2
                  </div>
                  <p>Provide your <strong>Order ID</strong> and detailed explanation</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    3
                  </div>
                  <p>Include any relevant <strong>screenshots or proof</strong> of technical issues</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    4
                  </div>
                  <p>Wait for our team to review your request (2-3 business days)</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Need Help?</h2>
            </div>
            <div className="space-y-3">
              <p className="text-gray-700">
                For refund requests or any questions about this policy, please contact us:
              </p>
              <div className="bg-white rounded-lg p-4 border">
                <p className="font-semibold text-primary">Email Support</p>
                <p className="text-lg">
                  <a href="mailto:digital.districtofficial@gmail.com" className="text-primary hover:underline">
                    digital.districtofficial@gmail.com
                  </a>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Please include your Order ID in the subject line
                </p>
              </div>
            </div>
          </section>

          {/* Processing Time */}
          <section className="bg-white rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-4">Processing Time</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                If your refund request is approved (rare exceptions only):
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Processing time: 5-7 business days</li>
                <li>Refund will be credited to your original payment method</li>
                <li>You will receive email confirmation once processed</li>
                <li>Bank processing may take additional 3-5 business days</li>
              </ul>
            </div>
          </section>

          {/* Footer Note */}
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-gray-600">
              By making a purchase, you acknowledge that you have read, understood, and agree to this 
              Cancellation & Refund Policy. This policy is effective as of the date of purchase.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default CancellationRefund;