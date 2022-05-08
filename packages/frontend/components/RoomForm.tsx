import { Input } from "@chakra-ui/input";
import { Box, Button, FormControl, FormLabel, Heading } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Select } from "chakra-react-select";
import { useQuery } from "react-query";
import { getUsers } from "../api/user";
import { Room, User, UserProfile } from "@next-chat/types";
import { useAuth } from "../context/AuthContext";
import { LoadingScreen } from "./LoadingScreen";

interface RoomCreateFormPayload {
  ID?: Room["ID"];
  name: string;
  userIds: string[];
}

interface RoomFormProps {
  onSubmit: (payload: RoomCreateFormPayload) => void;
  onCancel: () => void;
  room?: Pick<Room, "ID">;
}

export const RoomForm = (props: RoomFormProps) => {
  const { onSubmit, onCancel, room } = props;
  const { user } = useAuth();
  const isEditForm = room !== undefined;
  const { isLoading, data: userProfiles } = useQuery<UserProfile[]>(
    "users",
    getUsers
  );
  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
    setValue,
  } = useForm<RoomCreateFormPayload>();
  const usersDropdownVals = userProfiles
    ?.filter((u) => u.ID !== user!.ID)
    .map((u) => ({
      label: u.email,
      value: u.ID,
    }));
  const getDropdownVal = (userId: User["ID"]) => {
    const user = userProfiles.find((u) => u.ID === userId);

    return {
      label: user.email,
      value: userId,
    };
  };
  useEffect(() => {
    if (isEditForm) {
      setValue(
        "userIds",
        room.users.map((u) => u.userId)
      );

      setValue("name", room.name);
    }
  }, [isEditForm, setValue, room]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit)();
      }}
    >
      <Heading mt={10}>
        {isEditForm ? `Edit room ${room.ID}` : "Create room"}
      </Heading>
      <FormControl id="name" mt={8} isDisabled={isSubmitting}>
        <FormLabel>Room name</FormLabel>
        <Input
          {...register("name")}
          disabled={isSubmitting}
          type="text"
          placeholder="e.g. Alex's room"
        />
      </FormControl>
      <Controller
        control={control}
        name="userIds"
        render={({ field: { onChange, onBlur, name, value } }) => (
          <FormControl id={name} mt={2} isDisabled={isSubmitting}>
            <FormLabel>Users</FormLabel>
            <Select
              name={name}
              isMulti
              isLoading={isLoading}
              value={value
                ?.map(getDropdownVal)
                .filter((u) => u.value !== user?.ID)}
              onChange={(vals) => {
                const userIds = vals.map((v) => v.value);
                onBlur();
                onChange(userIds);
              }}
              options={usersDropdownVals ?? []}
            />
          </FormControl>
        )}
      />
      {room && (
        <Controller
          control={control}
          name="ID"
          render={() => <input type="hidden" value={room.ID} />}
        />
      )}
      <Box mt={6} display="flex" justifyContent="center">
        <Button
          colorScheme="blue"
          type="submit"
          isLoading={isSubmitting}
          mr={4}
        >
          {isEditForm ? "Edit" : "Create"}
        </Button>
        <Button onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </Box>
    </form>
  );
};
