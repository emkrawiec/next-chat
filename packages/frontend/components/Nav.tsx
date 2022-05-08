import { Box } from "@chakra-ui/layout";
import React from "react";
import { useAuth } from "../context/AuthContext";
import {
  AiTwotoneHome,
  AiOutlineWechat,
  AiOutlineUser,
  AiFillShop,
} from "react-icons/ai";
import { Button, IconButton } from "@chakra-ui/button";
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/popover";
import Link from "next/link";

export const Nav = () => {
  const { logout } = useAuth();

  return (
    <Box
      w={20}
      h="100vh"
      borderRight="1px"
      borderColor="gray.100"
      display="flex"
      flexDirection="column"
      alignItems="center"
      flexShrink={0}
    >
      <Link href="/" passHref>
        <IconButton
          as="a"
          w={12}
          h={12}
          aria-label="Go to Rooms"
          mt={6}
          icon={
            <AiTwotoneHome
              style={{
                width: 30,
                height: "auto",
              }}
            />
          }
        />
      </Link>
      <Link href="/rooms" passHref>
        <IconButton
          as="a"
          w={12}
          h={12}
          aria-label="Go to Rooms"
          mt={6}
          icon={
            <AiOutlineWechat
              style={{
                width: 30,
                height: "auto",
              }}
            />
          }
        />
      </Link>
      <Link href="/marketplace" passHref>
        <IconButton
          as="a"
          w={12}
          h={12}
          aria-label="Go to Marketplace"
          mt={6}
          icon={
            <AiFillShop
              style={{
                width: 30,
                height: "auto",
              }}
            />
          }
        />
      </Link>

      <Popover>
        <PopoverTrigger>
          <IconButton
            w={12}
            h={12}
            aria-label="Open profile popover"
            mt="auto"
            mb={6}
            icon={
              <AiOutlineUser
                style={{
                  width: 30,
                  height: "auto",
                }}
              />
            }
          />
        </PopoverTrigger>
        <PopoverContent w={32} p={4}>
          <PopoverArrow />
          <Box mb={4} display="flex" justifyContent="center">
            <Link href="/profile" passHref>
              <Button as="a">Profile</Button>
            </Link>
          </Box>
          <Box display="flex" justifyContent="center">
            <Button onClick={logout}>Logout</Button>
          </Box>
        </PopoverContent>
      </Popover>
    </Box>
  );
};
