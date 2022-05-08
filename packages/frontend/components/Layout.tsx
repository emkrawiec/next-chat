import { Box } from "@chakra-ui/layout";
import { useRouter } from "next/router";
import React from "react";
import { useAuth } from "../context/AuthContext";
import { LoadingScreen } from "./LoadingScreen";
import { Nav } from "./Nav";

export const Layout: React.FC = (props) => {
  const router = useRouter();
  const { children } = props;
  const { isLoggedIn, isLoadingUser } = useAuth();

  if (isLoadingUser) {
    return (
      <Box w="100%" h="100vh">
        <LoadingScreen />;
      </Box>
    );
  }

  return (
    <Box maxW="100%" w={1140} maxH="100vh" mx="auto" display="flex">
      {isLoggedIn && router.pathname !== "/login" && <Nav />}
      {children}
    </Box>
  );
};
