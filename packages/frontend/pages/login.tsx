import type { NextPage } from "next";
import { useContext, useState } from "react";
import { Input, Button, Container, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { login } from "../api/auth";
import { useAuth } from "../context/AuthContext";
//

type LoginPageStates =
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

const Login: NextPage = () => {
  const router = useRouter();
  const { setAuthStatus } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<LoginPageStates>({
    type: "INPUT",
  });
  const isLoading = state.type === "LOADING";
  const isError = state.type === "ERROR";

  const loginUser = () =>
    login({
      email,
      password,
    })
      .then((res) => {
        const userProfile = res.data;
        setAuthStatus({
          type: "LOGGED_IN",
          user: userProfile,
        });
        router.push("/rooms");
      })
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
          loginUser();
        }}
      >
        <Input
          placeholder="e.g. email@email.com"
          name="email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          disabled={isLoading}
        />
        <Input
          name="password"
          type="password"
          placeholder="Your password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          disabled={isLoading}
          mt={8}
        />
        {isError && <Text>{state.error.message}</Text>}

        <Button mt={4} type="submit" colorScheme="blue" isLoading={isLoading}>
          Login
        </Button>
      </form>
    </Container>
  );
};

export default Login;
