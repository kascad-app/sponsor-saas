"use client";

import { useRouter } from "next/navigation";
import React from "react";
import Cookies from "js-cookie";
import { useAPI } from "./use-api";

import { Sponsor } from "@kascad-app/shared-types";
import { ROUTES } from "../constants/ROUTES";
import {
  AuthenticationAPI,
  AuthenticationTypes,
} from "@/src/entities/authentication";

const useSession = (mustAuth = false): AuthenticationTypes.Session => {
  const loggedIn = Cookies.get(
    process.env.NEXT_PUBLIC_LOGGED_IN_COOKIE_NAME ?? "logged-in"
  );
  const router = useRouter();
  const {
    data: user,
    mutate,
    isLoading,
    isValidating,
  } = useAPI<Sponsor>(loggedIn ? "/auth/me" : null, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const signOut = React.useCallback(async () => {
    await AuthenticationAPI.logout();
    window.location.href = ROUTES.HOMEPAGE;
  }, []);

  const redirectToLogin = React.useCallback(() => {
    router.push(ROUTES.AUTH.LOGIN);
  }, []);

  React.useEffect(() => {
    if (mustAuth && !user && !isLoading) {
      redirectToLogin();
    }
  }, [mustAuth, user, isLoading]);

  return {
    mutate,
    loading: isLoading,
    ...(user
      ? {
          loggedIn: true,
          user: user as unknown as Sponsor,
          validating: isValidating,
          signOut,
        }
      : {
          loggedIn: false,
          user,
        }),
  };
};

export default useSession;
