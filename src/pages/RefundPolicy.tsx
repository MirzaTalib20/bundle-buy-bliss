import { Helmet } from 'react-helmet-async';

const RefundPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Cancellation and Refund Policy | YourWebsiteName</title>
      </Helmet>
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Cancellation and Refund Policy</h1>
        <p className="text-gray-700 leading-relaxed mb-4">
          As we sell digital products delivered instantly via email, we do not offer cancellations or refunds once the order is completed.
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>All sales are final once the payment is confirmed and the digital file has been delivered.</li>
          <li>Exceptions may be made only in the case of:
            <ul className="list-disc list-inside ml-6">
              <li>Duplicate purchase (accidental repeat order)</li>
              <li>Technical issues preventing download (with proof)</li>
            </ul>
          </li>
          <li>We do not refund for buyer's remorse or mistaken purchases.</li>
        </ul>
        <p className="text-gray-700 mt-4">To request help, please email <strong>digital.districtofficial@gmail.com</strong> with your order ID.</p>
      </main>
    </>
  );
};

export default RefundPolicy;