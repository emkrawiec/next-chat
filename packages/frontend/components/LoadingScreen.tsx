import React from "react";
import { Box } from "@chakra-ui/layout";
import { Spinner, Heading } from "@chakra-ui/react";

export const LoadingScreen = () => {
  return (
    <Box
          w="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      alignSelf="stretch"
    >
      <Heading fontSize="2xl" as="p" mb="3">
        Loading...
      </Heading>
      <Spinner size="lg" />
    </Box>
  );
};
