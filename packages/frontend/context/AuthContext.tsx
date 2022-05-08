import { LoginPayload, UserProfile } from "@next-chat/types";
import { createContext, useContext, useEffect, useState } from "react";
import { getUser, logout, login } from "../api/auth";
import router, { useRouter } from "next/router";

type AuthContext = {
  user: UserProfile | null;
  isLoggedIn: boolean;
  isLoadingUser: boolean;
  isLoggedOut: boolean;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  setAuthStatus: (status: AuthStatus) => void;
};

type AuthStatus =
  | {
      type: "LOGGED_IN";
      user: UserProfile;
    }
  | {
      type: "NOT_LOGGED_IN";
    }
  | {
      type: "LOADING";
    };

export const AuthContext = createContext<AuthContext | undefined>(undefined);

export const AuthContextProvider: React.FC = (props) => {
  const { children } = props;
  const [status, setStatus] = useState<AuthStatus>({
    type: "NOT_LOGGED_IN",
  });
  const isLoggedIn = status.type === "LOGGED_IN";
  const isLoggedOut = status.type === "NOT_LOGGED_IN";
  const isLoadingUser = status.type === "LOADING";
  const fetchUserProfile = () => {
    setStatus({
      type: "LOADING",
    });
    return getUser()
      .then((res) => {
        const userProfile = res.data;
        setStatus({
          type: "LOGGED_IN",
          user: userProfile,
        });
      })
      .catch(() => {
        router.push("/login").then(() => {
          setStatus({
            type: "NOT_LOGGED_IN",
          });
        });
      });
  };

  const logoutUser = () => {
    setStatus({
      type: "LOADING",
    });

    return logout().then(() => {
      router.push("/login").then(() => {
        setStatus({
          type: "NOT_LOGGED_IN",
        });
      });
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user: status.type === "LOGGED_IN" ? status.user : null,
        isLoggedIn,
        isLoadingUser,
        isLoggedOut,
        logout: logoutUser,
        fetchUser: fetchUserProfile,
        setAuthStatus: setStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("AuthContext must be used inside AuthContext.Provider");
  }

  return ctx;
};
