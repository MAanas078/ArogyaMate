import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PaymentPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { state } = useLocation(); // Retrieve data passed through navigate()
  const { clientSecret, amount, appointmentId } = state || {};
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) {
      toast.error('Stripe has not loaded properly.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    setLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        toast.error(`Payment failed: ${error.message}`);
      } else if (paymentIntent.status === 'succeeded') {
        toast.success('Payment Successful!');
        navigate('/appointments'); // Redirect to appointments page
      }
    } catch (err) {
      toast.error(`Payment processing failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!clientSecret || !amount) {
    return <p>Invalid payment details. Please try again.</p>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Complete Your Payment</h2>
      <p>Amount: ${amount}</p>
      <div style={{ margin: '20px 0' }}>
        <CardElement />
      </div>
      <button
        onClick={handlePayment}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
};

export default PaymentPage;
