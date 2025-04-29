import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Component that contains the form for collecting payment details
const PaymentForm = ({ amount, onComplete }: { amount: number, onComplete: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);
    setPaymentError(null);

    try {
      // Create a payment intent on the server
      const { clientSecret, id } = await apiRequest('POST', '/api/create-payment-intent', { 
        amount,
      }).then(res => res.json());

      // Use the client secret to confirm the payment
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'USF Parking User', // In a real app, get this from a form
          },
        },
      });

      if (error) {
        throw new Error(error.message || 'Payment failed');
      }

      if (paymentIntent?.status === 'succeeded') {
        toast({
          title: 'Payment Successful',
          description: `You've been charged $${amount.toFixed(2)} for your parking reservation.`,
          variant: 'default',
        });
        onComplete();
      } else {
        throw new Error('Payment has not been completed.');
      }
    } catch (err: any) {
      console.error('Payment failed:', err);
      setPaymentError(err.message || 'An error occurred during payment processing.');
      toast({
        title: 'Payment Failed',
        description: err.message || 'An error occurred during payment processing.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Card details</label>
            <div className="p-3 border rounded-md">
              <CardElement 
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
          </div>
          
          {paymentError && (
            <div className="text-red-500 text-sm mt-2">{paymentError}</div>
          )}
          
          <div className="bg-neutral-50 p-3 rounded-md mt-4">
            <div className="flex justify-between">
              <span>Total Amount:</span>
              <span className="font-semibold">${amount.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2">
          <Button 
            type="submit" 
            disabled={!stripe || isLoading}
            className="bg-[#006747] hover:bg-[#00543a]"
          >
            {isLoading ? (
              <span className="flex items-center">
                Processing <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-opacity-50 border-t-transparent"></span>
              </span>
            ) : (
              `Pay $${amount.toFixed(2)}`
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

// Main wrapper component that initializes Stripe
interface StripePaymentFormProps {
  amount: number;
  onComplete: () => void;
}

const StripePaymentForm = ({ amount, onComplete }: StripePaymentFormProps) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm amount={amount} onComplete={onComplete} />
    </Elements>
  );
};

export default StripePaymentForm;