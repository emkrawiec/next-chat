import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthContextProvider } from "../context/AuthContext";
import React from "react";
import { Layout } from "../components/Layout";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <ChakraProvider>
        <QueryClientProvider client={queryClient}>
          <Layout>
            <Component {...pageProps} />
            <ReactQueryDevtools />
          </Layout>
        </QueryClientProvider>
      </ChakraProvider>
    </AuthContextProvider>
  );
}

export default App;
