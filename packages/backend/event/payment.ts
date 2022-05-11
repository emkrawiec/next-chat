import mitt from 'mitt';
//
import {
  addFeatureForUser,
  prepareAddFeatureForUserDtoFromPaymentFullfilledEvent,
} from '../services/feature';

export interface PaymentFullfilledEvent {
  paymentIntentId: number;
}

export const paymentEventEmitter = mitt<{
  payment_fulfilled: PaymentFullfilledEvent;
}>();

paymentEventEmitter.on('payment_fulfilled', async (payload) => {
  const dto = await prepareAddFeatureForUserDtoFromPaymentFullfilledEvent(
    payload
  );
  addFeatureForUser(dto);
});
