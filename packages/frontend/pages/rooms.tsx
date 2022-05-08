import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Container, Box, Text, Button, Heading } from "@chakra-ui/react";
import { withAuth } from "../hoc/withAuth";
//
import { ROUTES } from "../routes";
import { ConditionalWrapper } from "../utils/ConditionalWrapper";
import { getRooms, archiveRoom } from "../api/room";
import { LoadingScreen } from "../components/LoadingScreen";

type ManagementState = "NORMAL" | "EDIT";

const Rooms: NextPage = withAuth((props) => {
  const { user } = props;
  const [managementState, setManagementState] =
    useState<ManagementState>("NORMAL");
  const queryClient = useQueryClient();
  const { isLoading, data: rooms } = useQuery("rooms", getRooms);
  const { mutate: archive, isLoading: isArchiving } = useMutation(archiveRoom, {
    onSuccess: () => queryClient.invalidateQueries("rooms"),
  });
  const toggleManagementState = () => {
    if (managementState === "EDIT") {
      setManagementState("NORMAL");
    } else {
      setManagementState("EDIT");
    }
  };
  const RoomTag: React.ElementType = managementState === "EDIT" ? "span" : "a";

  if (isLoading || isArchiving) {
    return <LoadingScreen />;
  }

  return (
    <Container>
      <Box display="flex" py={4} justifyContent="flex-end">
        <Link href="/rooms/create" passHref>
          <Button as="a" colorScheme="blue" mr={4}>
            Create room
          </Button>
        </Link>
        <Button
          colorScheme="orange"
          onClick={() => {
            toggleManagementState();
          }}
        >
          {managementState === "EDIT" ? "Preview Rooms" : "Manage rooms"}
        </Button>
      </Box>
      {rooms &&
        rooms.map((r, i, arr) => (
          <div key={r.ID}>
            <ConditionalWrapper
              condition={managementState !== "EDIT"}
              wrapper={(children) => (
                <Link href={`/rooms/${r.ID}`} passHref>
                  {children}
                </Link>
              )}
            >
              <RoomTag>
                <Box
                  borderRadius="lg"
                  borderWidth="1px"
                  p={4}
                  mb={i !== arr.length - 1 ? 3 : ""}
                >
                  <Box display="flex" alignItems="center">
                    <Box display="flex" flexDirection="column">
                      <Heading as="p" size="md" mb="auto">
                        {r.name}
                      </Heading>
                      <Box mt={2} display="flex" alignItems="center">
                        <Heading size="sm" as="p" mr={1}>
                          No of users:
                        </Heading>
                        {r.users.length}
                      </Box>
                      <Box mt={1} display="flex" alignItems="center">
                        <Heading size="sm" as="p" mr={1}>
                          Author:
                        </Heading>
                        {r.creator.email}
                      </Box>
                    </Box>

                    {managementState === "EDIT" && r.creator.ID === user.ID && (
                      <Box display="flex" flexDirection="column" ml="auto">
                        <Button
                          type="button"
                          onClick={() => {
                            archive(r.ID);
                          }}
                        >
                          Archive
                        </Button>
                        <Link href={ROUTES.editRoom(r.ID)} passHref>
                          <Button as="a">Edit</Button>
                        </Link>
                      </Box>
                    )}
                  </Box>
                </Box>
              </RoomTag>
            </ConditionalWrapper>
          </div>
        ))}
    </Container>
  );
});

export default Rooms;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {},
  };
};
