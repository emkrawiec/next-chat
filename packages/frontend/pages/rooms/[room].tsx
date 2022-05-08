import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Button, Textarea, Box, Text } from "@chakra-ui/react";
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/popover";
import {
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { Message, Room, User, UserProfile } from "@next-chat/types";
//
import { kickOutOfRoom } from "../../api/room";
import { withAuth } from "../../hoc/withAuth";
import { LoadingScreen } from "../../components/LoadingScreen";
import { UserAvatar } from "../../components/UserAvatar";

interface RoomPageProps {
  roomId: Room["ID"];
  user: UserProfile;
}

type RoomState =
  | {
      type: "WS_LOADING";
    }
  | {
      type: "WS_READY";
      messages: Message[];
      users: UserProfile[];
      room: Room;
    };

type KickOutUserState =
  | {
      type: "NO_KICK_USER_CANDIDATE";
    }
  | {
      type: "HAS_KICK_USER_CANDIDATE";
      kickUserCandidate: User;
    }
  | {
      type: "USER_BEING_KICKED_OUT";
    };

const Room: NextPage = withAuth<RoomPageProps>((props) => {
  const router = useRouter();
  const { user, roomId } = props;
  const socketRef = useRef<Socket | null>();
  const [state, setState] = useState<RoomState>({
    type: "WS_LOADING",
  });
  const isChatIniting = state.type === "WS_LOADING";
  const [message, setMessage] = useState("");
  const [kickOutUserState, setKickOutUserState] = useState<KickOutUserState>({
    type: "NO_KICK_USER_CANDIDATE",
  });
  const isKickedOutUser = (userId: User["ID"]) =>
    state.type === "WS_READY"
      ? state.room.kickedUserIds.includes(userId)
      : false;
  const nonKickedUsers =
    state.type === "WS_READY"
      ? state.users.filter((u) => !isKickedOutUser(u.ID))
      : [];
  const getUserById = (id: UserProfile["ID"]) =>
    state.type === "WS_READY"
      ? state.users.find((u) => u.ID === id)
      : undefined;

  useEffect(() => {
    if (state.type === "WS_READY" && isKickedOutUser(user.ID)) {
      router.push({
        pathname: "/rooms",
        query: {
          warn: "You have been kicked out!",
        },
      });
    }
  }, [state, user, router, isKickedOutUser]);

  useEffect(() => {
    const socket = io(`ws://localhost:3001/rooms`, {
      withCredentials: true,
    });

    if (!socketRef.current) {
      socket.on("connect", () => {
        socketRef.current = socket;

        socket.emit("room:join", {
          roomId,
        });

        socket.emit(
          "room:init",
          {
            roomId: Number(roomId),
          },
          (payload: {
            messages: Message[];
            users: UserProfile[];
            room: Room;
          }) => {
            setState({
              type: "WS_READY",
              messages: payload.messages,
              users: payload.users,
              room: payload.room,
            });
          }
        );

        socket.on("room:new-message", (message) => {
          setState((oldState) => ({
            ...oldState,
            messages: [...oldState.messages, message],
          }));
        });

        socket.on(
          "room:update",
          (payload: { users: UserProfile[]; room: Room }) => {
            setState((oldState) => ({
              ...oldState,
              users: payload.users,
              room: payload.room,
            }));
          }
        );
      });
    }

    return () => {
      socket.emit("room:leave", {
        roomId,
      });
      socketRef.current = null;
    };
  }, [roomId]);

  const postMessage = () => {
    if (message.trim() !== "") {
      socketRef.current?.emit("room:post-message", {
        roomId: Number(roomId),
        message,
        createdAt: new Date().toISOString(),
      });

      setMessage("");
    }
  };

  if (isChatIniting) {
    return <LoadingScreen />;
  }

  const UserListUserAvatar = ({
    avatar,
    email,
  }: Pick<User, "avatar" | "email">) => (
    <UserAvatar avatarSrc={avatar} userEmail={email} />
  );

  return (
    <>
      <Box
        w="100%"
        h="100vh"
        maxH="100vh"
        px="40"
        display="flex"
        flexDirection="column"
      >
        <Box display="flex" alignItems="center" pt={2}>
          <Text mr={3}>Users:</Text>
          <Box display="flex">
            {state.type === "WS_READY"
              ? nonKickedUsers.map((u) => (
                  <Box mr={2} key={u.ID}>
                    {u.ID === user.ID ? (
                      <UserListUserAvatar avatar={u.avatar} email={u.email} />
                    ) : (
                      <Popover placement="bottom">
                        <PopoverTrigger>
                          <Box
                            tabIndex={0}
                            role="button"
                            aria-label="Open user popover"
                          >
                            <UserListUserAvatar
                              avatar={u.avatar}
                              email={u.email}
                            />
                          </Box>
                        </PopoverTrigger>
                        <PopoverContent p={4} w={36}>
                          <PopoverArrow />
                          <Box
                            display="flex"
                            justifyContent="center"
                            onClick={() => {
                              setKickOutUserState({
                                type: "HAS_KICK_USER_CANDIDATE",
                                kickUserCandidate: u,
                              });
                            }}
                          >
                            <Button>Kick user</Button>
                          </Box>
                        </PopoverContent>
                      </Popover>
                    )}
                  </Box>
                ))
              : "Loading"}
          </Box>
        </Box>
        <Box
          overflowY="auto"
          maxH="calc(100% - 120px)"
          display="flex"
          flexDirection="column"
        >
          {state.messages.map((m, i, arr) => (
            <Box
              display="flex"
              key={m.ID}
              mt={4}
              mb={i === arr.length - 1 ? 4 : undefined}
              ml={m.authorId === user.ID ? "auto" : undefined}
              alignItems="center"
              maxW="50%"
            >
              <Tooltip
                placement="bottom"
                label="User is kicked out"
                isDisabled={!isKickedOutUser(m.authorId)}
                hasArrow
                shouldWrapChildren
              >
                <UserAvatar
                  userEmail={getUserById(m.authorId)?.email ?? "U"}
                  avatarSrc={getUserById(m.authorId)?.avatar ?? null}
                  isKickedOutOfRoom={isKickedOutUser(m.authorId)}
                />
              </Tooltip>
              <Box
                bg="lightblue"
                color="white"
                alignSelf="flex-start"
                py={2}
                px={3}
                ml={3}
                borderRadius="lg"
                opacity={isKickedOutUser(m.authorId) ? 0.4 : 1}
              >
                {m.message}
              </Box>
            </Box>
          ))}
        </Box>
        <Box mt="auto" mb={5}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              postMessage();
            }}
          >
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  postMessage();
                }
              }}
            />

            <Button colorScheme="blue" type="submit" mt={4}>
              Send
            </Button>
          </form>
        </Box>
      </Box>
      <Modal
        isOpen={kickOutUserState.type !== "NO_KICK_USER_CANDIDATE"}
        onClose={() =>
          setKickOutUserState({
            type: "NO_KICK_USER_CANDIDATE",
          })
        }
      >
        <ModalOverlay />
        <ModalContent>
          {kickOutUserState.type === "USER_BEING_KICKED_OUT" ? (
            <LoadingScreen />
          ) : (
            <>
              <ModalHeader textAlign="center">
                Are you sure you want to kick out{" "}
                {kickOutUserState?.kickUserCandidate?.email}?
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                User will be kicked out of room and won't be able to join it.
              </ModalBody>

              <ModalFooter>
                <Button
                  colorScheme="blue"
                  my="auto"
                  onClick={async () => {
                    try {
                      setKickOutUserState({
                        type: "USER_BEING_KICKED_OUT",
                      });
                      await kickOutOfRoom(
                        roomId,
                        kickOutUserState.kickUserCandidate.ID
                      );
                      setKickOutUserState({
                        type: "NO_KICK_USER_CANDIDATE",
                      });
                    } catch (err: unknown) {
                      setKickOutUserState({
                        type: "NO_KICK_USER_CANDIDATE",
                      });
                    }
                  }}
                >
                  Kick out
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
});

export default Room;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      roomId: Number(ctx.query.room),
    },
  };
};
