import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const PaymentModal = ({ show, onHide, appointmentId, amount, backendUrl, token }) => {
  const [loading, setLoading] = useState(false);
  const isPaymentInitiated = useRef(false);

  useEffect(() => {
    if (!show) return;
    if (isNaN(amount) || amount <= 0) {
      toast.error('Invalid amount');
      return;
    }

    if (appointmentId && amount && show && !isPaymentInitiated.current) {
      const initiatePayment = async () => {
        try {
          setLoading(true);
          isPaymentInitiated.current = true;

          const { data } = await axios.post(
            backendUrl + '/api/user/payment-stripe',
            { appointmentId, amount },
            { headers: { token } }
          );

          if (data.success && data.session_url) {
            // Redirect to Stripe Checkout
            window.location.href = data.session_url;
          } else {
            toast.error(data.message || "Stripe session failed");
            onHide();
          }
        } catch (error) {
          toast.error('Failed to initiate payment');
          onHide();
        } finally {
          setLoading(false);
        }
      };
      initiatePayment();
    }
  }, [appointmentId, amount, backendUrl, token, show, onHide]);

  if (!show) return null;

  return (
    <div className="modal" style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-content">
        <h2>Redirecting to Payment...</h2>
        {loading && <p>Loading payment details...</p>}
        <button
          onClick={onHide}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
