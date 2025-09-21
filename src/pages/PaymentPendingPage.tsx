import React from 'react';
import { useSearchParams } from 'react-router-dom';

const PaymentPendingPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get('orderId');
  const transactionId = searchParams.get('transactionId');

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>⏳ Payment is Pending</h1>
      <p style={styles.text}>
        We’ve received your order, but the payment is still being processed by PhonePe.
      </p>

      <div style={styles.infoBox}>
        <p><strong>Order ID:</strong> {orderId}</p>
        <p><strong>Transaction ID:</strong> {transactionId}</p>
      </div>

      <p style={styles.text}>
        This may take a few minutes. You can refresh this page or check your order history later.
      </p>

      <button style={styles.button} onClick={() => window.location.reload()}>
        🔄 Refresh Status
      </button>
    </div>
  );
};

// Style object with appropriate type
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    border: '1px solid #ccc',
    borderRadius: '10px',
    background: '#fafafa',
  },
  heading: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  text: {
    fontSize: '16px',
    color: '#333',
  },
  infoBox: {
    background: '#f1f1f1',
    padding: '15px',
    borderRadius: '5px',
    margin: '20px 0',
    textAlign: 'left',
  },
  button: {
    padding: '10px 20px',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default PaymentPendingPage;
