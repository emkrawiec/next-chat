import type { GetServerSideProps, NextPage } from "next";
import React, { useState } from "react";
import { Input, Button, Container, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
//
import { checkPasswordRecoveryToken, recoverPassword } from "../api/auth";

interface PassRecoveryPageProps {
  token: string;
}

type PassRecoveryPageStates =
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

const PassRecovery: NextPage<PassRecoveryPageProps> = (props) => {
  const { token } = props;
  const router = useRouter();
  const [state, setState] = useState<PassRecoveryPageStates>({
    type: "INPUT",
  });
  const [password, setPassword] = useState("");
  const isLoading = state.type === "LOADING";
  const isError = state.type === "ERROR";

  const sendPasswordRecovery = () =>
    recoverPassword({
      token,
      newPassword: password,
    })
      .then(() => {
        setState({
          type: "SUCCESS",
        });
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      })
      .catch((err: Error) =>
        setState({
          type: "ERROR",
          error: err,
        })
      );

  return (
    <Container mt={20}>
      <Heading as="h1">Pass recovery</Heading>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendPasswordRecovery();
        }}
      >
        <Input
          name="password"
          type="password"
          placeholder="Your new password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          mt={8}
          disabled={isLoading}
        />

        <Button mt={4} type="submit" colorScheme="blue" isLoading={isLoading}>
          Recover password
        </Button>
      </form>
    </Container>
  );
};

export default PassRecovery;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    query: { token },
  } = ctx;

  if (!token) {
    return {
      props: {},
      redirect: {
        destination: "/login",
      },
    };
  }

  try {
    await checkPasswordRecoveryToken(token as string);

    return {
      props: {
        token,
      },
    };
  } catch (err: unknown) {
    return {
      props: {},
      redirect: {
        destination: "/login",
      },
    };
  }
};
