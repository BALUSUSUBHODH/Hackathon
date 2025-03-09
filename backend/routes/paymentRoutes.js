const express = require("express");
const stripe = require("stripe")("sk_test_51MOH8zSB0s2EMORR2teTn6oEUFDXL7d0QB9pOZMMReYJ3jvzvhj4MLB2SLAelSW9U8ZdkAbngNUWqXhGIdD26cEG00y7bfkZda");
const router = express.Router();

router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, customerName, customerEmail, address } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "inr",
      payment_method_types: ["card"],
      description: "E-commerce Product Purchase",
      shipping: {
        name: customerName,
        address: {
          line1: address.line1,
          city: address.city,
          postal_code: address.postal_code,
          country: "IN",
        },
      },
      metadata: {
        customer_email: customerEmail,
        transaction_purpose_code: "P0108",
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;