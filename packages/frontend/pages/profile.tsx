import React from "react";
import { NextPage } from "next";
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box } from "@chakra-ui/layout";
import { editUserProfile } from "../api/user";
import { withAuth } from "../hoc/withAuth";

const Profile: NextPage = withAuth((props) => {
  const { user } = props;

  return (
    <Box>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          editUserProfile(new FormData(e.currentTarget));
        }}
        encType="multipart/form-data"
      >
        <FormControl>
          <FormLabel>Avatar</FormLabel>
          <Input
            type="file"
            name="avatar"
            accept=".jpg,.jpeg,.png,.webp,.avif"
          />
        </FormControl>
        <Button colorScheme="blue" type="submit">
          Submit
        </Button>
      </form>
    </Box>
  );
});

export default Profile;
