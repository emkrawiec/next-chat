import { loadStripe, Stripe } from "@stripe/stripe-js";
import { useEffect, useRef } from "react";

export const usePaymentGateway = () => {
  const stripeRef = useRef<Stripe>();
  useEffect(() => {
    const initStripe = async () => {
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      stripeRef.current = stripe!;
    }
    initStripe();
  }, [])
  
  return stripeRef;
}