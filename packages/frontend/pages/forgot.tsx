import type { NextPage } from "next";
import { useState } from "react";
import { Input, Button, Container, Text } from "@chakra-ui/react";
//
import { preparePasswordRecovery } from "../api/auth";

type ForgotPageStates =
  | {
      type: "INPUT";
    }
  | {
      type: "ERROR";
      error: Error;
    }
  | {
      type: "LOADING";
    }
  | {
      type: "SUCCESS";
    };

const Forgot: NextPage = () => {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<ForgotPageStates>({
    type: "INPUT",
  });
  const isLoading = state.type === "LOADING";
  const isError = state.type === "ERROR";

  const sendForgotPasswordRequest = () =>
    preparePasswordRecovery({
      email,
    })
      .then(() =>
        setState({
          type: "SUCCESS",
        })
      )
      .catch((err: Error) =>
        setState({
          type: "ERROR",
          error: err,
        })
      );

  return (
    <Container mt={20}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setState({
            type: "LOADING",
          });
          sendForgotPasswordRequest();
        }}
      >
        <Input
          placeholder="e.g. email@email.com"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        {isError && (
          <Text color="red">Something went wrong, please try again later.</Text>
        )}

        <Button mt={4} type="submit" colorScheme="blue" isLoading={isLoading}>
          Recover
        </Button>
      </form>
    </Container>
  );
};

export default Forgot;
