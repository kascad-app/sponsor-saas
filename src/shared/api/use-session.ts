"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { ROUTES } from "../constants/ROUTES";
import { AuthenticationTypes } from "@/src/entities/authentication";
import { useMe } from "@/src/entities/authentication/authentication.hooks";
import { Sponsor } from "@kascad-app/shared-types";

const useSession = (mustAuth = true): AuthenticationTypes.Session => {
  const router = useRouter();
  const { data: user, mutate, isLoading, isValidating } = useMe();

  React.useEffect(() => {
    if (mustAuth && !isAuthenticated(user) && !isLoading) {
      router.push(ROUTES.AUTH.LOGIN);
    }
  }, [mustAuth, user, isLoading, router.push]);

  function isAuthenticated(user: unknown): user is Sponsor {
    return (
      !!user &&
      typeof user === "object" &&
      !("statusCode" in user) &&
      !(
        "message" in user &&
        (user as { message?: string }).message === "Unauthorized"
      )
    );
  }

  if (isAuthenticated(user)) {
    return {
      loggedIn: true,
      user,
      validating: isValidating,
      mutate,
      loading: isLoading,
    };
  }

  return {
    loggedIn: false,
    user: undefined,
    mutate,
    loading: isLoading,
  };
};

export default useSession;
