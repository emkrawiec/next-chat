import { GetServerSideProps, NextPage } from "next";
import { Container } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "react-query";
//
import { editRoom, getRoom } from "../../../api/room";
import { withAuth } from "../../../hoc/withAuth";
import { RoomForm } from "../../../components/RoomForm";
import { EditRoomPayload, Room, UserProfile } from "@next-chat/types";
import { LoadingScreen } from "../../../components/LoadingScreen";
import { ComponentProps } from "react";

interface EditRoomPageProps {
  roomId: Room["ID"];
  user: UserProfile;
}

const EditRoomPage: NextPage<EditRoomPageProps> = withAuth<EditRoomPageProps>(
  (props) => {
    const { roomId } = props;
    const router = useRouter();
    const queryClient = useQueryClient();
    console.log(roomId);
    const { isLoading, data: room } = useQuery(["rooms", roomId], () =>
      getRoom(roomId)
    );
    const mutation = useMutation((payload: EditRoomPayload) =>
      editRoom(roomId, payload)
    );
    const onFormSubmit: ComponentProps<typeof RoomForm>["onSubmit"] = (
      payload
    ) =>
      mutation.mutateAsync(
        {
          ...payload,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries("rooms");
            queryClient.invalidateQueries(["rooms", roomId]);
            router.push("/rooms/");
          },
        }
      );

    if (isLoading) {
      return <LoadingScreen />;
    }

    return (
      <Container>
        <RoomForm
          room={room}
          onSubmit={onFormSubmit}
          onCancel={() => router.push("/rooms/")}
        />
      </Container>
    );
  }
);

export default EditRoomPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      roomId: Number(ctx.query.room),
    },
  };
};
