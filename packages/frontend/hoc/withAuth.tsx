import { UserProfile } from "@next-chat/types";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { LoadingScreen } from "../components/LoadingScreen";
import { useAuth } from "../context/AuthContext";

interface WithAuthProps {
  user: UserProfile;
}

export function withAuth<T extends WithAuthProps>(
  WrappedComponent: React.ComponentType<T>
) {
  const ComponentWithAuth = (props: Omit<T, keyof WithAuthProps>) => {
    const { isLoggedOut, isLoadingUser, fetchUser, user } = useAuth();

    useEffect(() => {
      if (isLoggedOut) {
        fetchUser();
      }
    }, []);

    if (isLoadingUser) {
      return <LoadingScreen />;
    }

    if (isLoggedOut) return null;

    return <WrappedComponent {...(props as T)} user={user} />;
  };

  ComponentWithAuth.displayName = `withAuth(${WrappedComponent.displayName})`;

  return ComponentWithAuth;
}
