import { Image } from "@chakra-ui/image";
import { Box, Text } from "@chakra-ui/layout";
import React, { forwardRef, MouseEventHandler } from "react";

interface UserAvatarProps {
  userEmail: string;
  isKickedOutOfRoom?: boolean;
  avatarSrc?: string | null;
  onClick?: MouseEventHandler;
  as?: React.ElementType;
}

export const UserAvatar = forwardRef<HTMLDivElement, UserAvatarProps>(
  (props, ref) => {
    const {
      userEmail,
      onClick,
      isKickedOutOfRoom = false,
      avatarSrc = null,
      as = "div",
    } = props;

    return (
      <Box
        as={as}
        display="flex"
        borderRadius="50%"
        justifyContent="center"
        alignItems="center"
        onClick={onClick}
        ref={ref}
        w={8}
        h={8}
        bg="lightblue"
        color="white"
        border="1px"
        borderColor="gray.300"
        overflow="hidden"
        opacity={isKickedOutOfRoom ? 0.6 : 1}
      >
        {avatarSrc ? (
          <Image
            objectFit="cover"
            src={`${process.env.NEXT_PUBLIC_HTTP_API_URL}/api/uploads/avatar/${avatarSrc}`}
            width="100%"
            height="100%"
            alt={`User ${userEmail} profile image.`}
          />
        ) : (
          <Text>{userEmail[0].toUpperCase()}</Text>
        )}
      </Box>
    );
  }
);

UserAvatar.displayName = "UserAvatar";
