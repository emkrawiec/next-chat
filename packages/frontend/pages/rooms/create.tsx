import { NextPage } from "next";
import React, { ComponentProps } from "react";
import { useMutation, useQueryClient } from "react-query";
import { RoomForm } from "../../components/RoomForm";
import { withAuth } from "../../hoc/withAuth";
import { createRoom } from "../../api/room";
import { CreateRoomPayload } from "@next-chat/types";
import { useRouter } from "next/router";
import { Container } from "@chakra-ui/react";

const CreateRoomPage: NextPage = withAuth(() => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation((payload: CreateRoomPayload) =>
    createRoom(payload)
  );
  const onFormSubmit: ComponentProps<typeof RoomForm>["onSubmit"] = (payload) =>
    mutation.mutateAsync(
      {
        ...payload,
        createdAt: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries("rooms");
          router.push("/rooms/");
        },
      }
    );

  return (
    <Container>
      <RoomForm
        onSubmit={onFormSubmit}
        onCancel={() => router.push("/rooms/")}
      />
    </Container>
  );
});

export default CreateRoomPage;
