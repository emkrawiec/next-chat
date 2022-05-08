import React from "react";
import { NextPage } from "next";
import { Box } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { withAuth } from "../hoc/withAuth";
import { makeFeaturePayment } from "../api/payment";
import { usePaymentGateway } from "../hooks/usePaymentGateway";

const Marketplace: NextPage = withAuth((props) => {
  const { user } = props;
  const paymentGatewayRef = usePaymentGateway();
  const features = [];

  return (
    <Box>
      <Button
        onClick={async () => {
          const checkoutSessionId = await makeFeaturePayment({
            featureId: 1,
            priceId: 1,
          });

          paymentGatewayRef.current?.redirectToCheckout({
            sessionId: checkoutSessionId!,
          });
        }}
      >
        Subscribe to feature
      </Button>
    </Box>
  );
});

export default Marketplace;
