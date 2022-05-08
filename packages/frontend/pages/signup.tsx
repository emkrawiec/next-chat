import type { NextPage } from "next";
import React, { useState } from "react";
import { Input, Button, Container, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
//
import { signup } from "../api/auth";

const Signup: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signupUser = () =>
    signup({
      email,
      password,
    }).then(() => router.push("/login"));

  return (
    <Container mt={20}>
      <Heading as="h1">Signup</Heading>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          signupUser();
        }}
      >
        <Input
          placeholder="e.g. email@email.com"
          name="email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <Input
          name="password"
          type="password"
          placeholder="Your password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          mt={8}
        />

        <Button mt={4} type="submit" colorScheme="blue">
          Signup
        </Button>
      </form>
    </Container>
  );
};

export default Signup;
