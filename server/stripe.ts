import { Express, Request, Response } from "express";
import Stripe from "stripe";
import { storage } from "./storage";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { payments } from "@shared/schema";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-03-31.basil",
});

export function setupStripeRoutes(app: Express) {
  // Create a payment intent for reservation
  app.post("/api/create-payment-intent", async (req: Request, res: Response) => {
    try {
      const { amount, userId, reservationId, paymentMethod = "credit_card" } = req.body;
      
      if (!amount) {
        return res.status(400).json({ error: "Amount is required" });
      }

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      
      // Create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert dollars to cents
        currency: "usd",
        metadata: {
          integration_check: "usf_parking_app_payment",
          user_id: userId.toString(),
          reservation_id: reservationId ? reservationId.toString() : undefined
        }
      });

      // Create a payment record in our database
      const payment = await storage.createPayment({
        user_id: userId,
        amount: amount,
        payment_method: paymentMethod,
        payment_status: "pending",
        stripe_payment_intent_id: paymentIntent.id,
        last_four: null,
        card_brand: null
      });

      // If there's a reservation associated, update it with the payment ID
      if (reservationId) {
        await storage.updateReservationPaymentId(reservationId, payment.id);
      }
      
      // Return the client secret to the client
      res.json({
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id,
        paymentId: payment.id
      });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({
        error: `Payment failed: ${error.message}`
      });
    }
  });

  // Confirm payment status
  app.get("/api/payment-status/:paymentIntentId", async (req: Request, res: Response) => {
    try {
      const { paymentIntentId } = req.params;
      
      if (!paymentIntentId) {
        return res.status(400).json({ error: "Payment intent ID is required" });
      }
      
      // Get payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      // Get payment from our database
      const payment = await storage.getPaymentByStripeId(paymentIntentId);
      
      if (payment) {
        // Update payment status if it's changed
        if (payment.payment_status !== paymentIntent.status) {
          await storage.updatePaymentStatus(payment.id, paymentIntent.status);
        }
        
        // If payment succeeded and reservation is associated, update reservation status
        if (paymentIntent.status === 'succeeded') {
          // Find the reservation associated with this payment
          const reservations = await storage.getReservations();
          const relatedReservation = reservations.find(r => r.payment_id === payment.id);
          
          if (relatedReservation) {
            await storage.updateReservation(relatedReservation.id, { status: 'confirmed' });
          }
        }
      }
      
      res.json({
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100, // Convert cents to dollars
        payment: payment
      });
    } catch (error: any) {
      console.error("Error retrieving payment intent:", error);
      res.status(500).json({
        error: `Failed to retrieve payment status: ${error.message}`
      });
    }
  });
  
  // Get all payments for a user
  app.get("/api/payments", async (req: Request, res: Response) => {
    try {
      const userId = Number(req.query.userId);
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      
      const payments = await storage.getPayments(userId);
      
      res.json(payments);
    } catch (error: any) {
      console.error("Error fetching payments:", error);
      res.status(500).json({
        error: `Failed to fetch payments: ${error.message}`
      });
    }
  });
  
  // Get a specific payment
  app.get("/api/payments/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      
      if (!id) {
        return res.status(400).json({ error: "Payment ID is required" });
      }
      
      const payment = await storage.getPayment(id);
      
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      
      res.json(payment);
    } catch (error: any) {
      console.error("Error fetching payment:", error);
      res.status(500).json({
        error: `Failed to fetch payment: ${error.message}`
      });
    }
  });

  // Webhook to handle payment events from Stripe
  app.post("/api/webhook", async (req: Request, res: Response) => {
    const payload = req.body;
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      // Verify webhook signature
      // Note: In production, you should configure endpointSecret
      // const endpointSecret = 'your_webhook_secret';
      // event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
      
      // For now, just parse the event
      event = payload;
      
      // Handle the event
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          console.log('Payment succeeded:', paymentIntent.id);
          
          // Find payment in our database and update status
          const payment = await storage.getPaymentByStripeId(paymentIntent.id);
          if (payment) {
            await storage.updatePaymentStatus(payment.id, 'succeeded');
            
            // If payment has a payment method and the method is credit_card, update card details
            if (paymentIntent.payment_method_details && 
                paymentIntent.payment_method_details.card) {
              const card = paymentIntent.payment_method_details.card;
              
              // Update card information
              await db.update(payments)
                .set({
                  last_four: card.last4,
                  card_brand: card.brand
                })
                .where(eq(payments.id, payment.id));
            }
            
            // Update reservation status
            const reservations = await storage.getReservations();
            const relatedReservation = reservations.find(r => r.payment_id === payment.id);
            
            if (relatedReservation) {
              await storage.updateReservation(relatedReservation.id, { status: 'confirmed' });
            }
          }
          break;
          
        case 'payment_intent.payment_failed':
          const failedPaymentIntent = event.data.object;
          console.log('Payment failed:', failedPaymentIntent.id);
          
          // Find payment in our database and update status
          const failedPayment = await storage.getPaymentByStripeId(failedPaymentIntent.id);
          if (failedPayment) {
            await storage.updatePaymentStatus(failedPayment.id, 'failed');
            
            // Update reservation status if exists
            const reservations = await storage.getReservations();
            const relatedReservation = reservations.find(r => r.payment_id === failedPayment.id);
            
            if (relatedReservation) {
              await storage.updateReservation(relatedReservation.id, { status: 'failed' });
            }
          }
          break;
          
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.json({ received: true });
    } catch (err: any) {
      console.error('Webhook error:', err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  });
}