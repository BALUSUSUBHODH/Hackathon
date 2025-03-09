import { useEffect, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Checkout.css";

const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [address, setAddress] = useState({ line1: "", city: "", postal_code: "400001" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const cart = location.state?.cart || [];

  const totalPrice = cart.reduce((acc, item) => acc + item.quantity * item.productId.price, 0);

  useEffect(() => {
    const createPaymentIntent = async () => {
      if (!customerName || !customerEmail || !address.line1 || !address.city || cart.length === 0) {
        return;
      }

      try {
        const response = await axios.post("https://hackathon-jsaa.onrender.com/api/payment/create-payment-intent", {
          amount: totalPrice * 100,
          customerName,
          customerEmail,
          address,
        });

        setClientSecret(response.data.clientSecret);
      } catch (error) {
        setMessage("Unable to initiate payment. Please try again.");
      }
    };

    createPaymentIntent();
  }, [cart, totalPrice, customerName, customerEmail, address]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      setMessage("Stripe hasn't loaded yet or details missing.");
      return;
    }

    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: customerName,
          email: customerEmail,
          address: {
            line1: address.line1,
            city: address.city,
            postal_code: address.postal_code,
            country: "IN",
          },
        },
      },
    });

    if (error) {
      setMessage(error.message);
    } else if (paymentIntent.status === "succeeded") {
      setMessage("Payment successful! Redirecting...");
      setTimeout(() => navigate("/"), 2000);
    }

    setLoading(false);
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <h3>Total: ₹{totalPrice.toFixed(2)}</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
          placeholder="Enter your name"
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          required
          placeholder="Enter your email"
        />

        <label htmlFor="address">Address Line 1</label>
        <input
          id="address"
          value={address.line1}
          onChange={(e) => setAddress({ ...address, line1: e.target.value })}
          required
          placeholder="Street address"
        />

        <label htmlFor="city">City</label>
        <input
          id="city"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
          required
          placeholder="City"
        />

        <label htmlFor="postal">Postal Code</label>
        <input
          id="postal"
          value={address.postal_code}
          onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
          required
          placeholder="Postal code"
        />

        <label>Card Details</label>
        <div className="my-4">
          <CardElement options={{ hidePostalCode: true }} />
        </div>

        <button type="submit" disabled={!stripe || loading || !clientSecret}>
          {loading ? "Processing..." : `Pay ₹${totalPrice.toFixed(2)}`}
        </button>
      </form>

      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default Checkout;
