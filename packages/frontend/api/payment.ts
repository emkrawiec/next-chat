import axios from 'axios';
import { CreateSubscriptionPayload, CreateSubscriptionResponsePayload } from '@next-chat/types';

export const makeFeaturePayment = async (payload: CreateSubscriptionPayload) => {
  try {
    const response = await axios.post<CreateSubscriptionResponsePayload>(`${process.env.NEXT_PUBLIC_HTTP_API_URL}/api/payment/create`, payload);
    
    return response.data.checkoutSessionId;
  } catch (err) {
    console.log(err);
  }
}