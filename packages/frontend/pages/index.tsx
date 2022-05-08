import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { withAuth } from "../hoc/withAuth";

const Home: NextPage = withAuth((props) => {
  return <div>Home</div>;
});

export default Home;
