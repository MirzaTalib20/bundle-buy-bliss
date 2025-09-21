import React from 'react';
import axios from 'axios';

interface PaymentButtonProps {
    amount: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    items: any[];
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
    amount,
    customerName,
    customerEmail,
    customerPhone,
    items
}) => {
    const handlePayment = async () => {
        try {
            const response = await axios.post('/api/payment/initiate', {
                amount,
                customerName,
                customerEmail,
                customerPhone,
                items
            });

            if (response.data.success) {
                window.location.href = response.data.paymentUrl;
            }
        } catch (error) {
            console.error('Payment initiation failed:', error);
            alert('Payment initiation failed. Please try again.');
        }
    };

    return (
        <button 
            onClick={handlePayment}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
            Pay ₹{amount}
        </button>
    );
};