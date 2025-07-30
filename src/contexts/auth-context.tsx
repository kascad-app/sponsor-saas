"use client";

import { createContext, useContext } from "react";
import { useSession } from "@/src/shared/api";
import { AuthenticationTypes } from "@/src/entities/authentication";

const AuthContext = createContext<AuthenticationTypes.Session | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const session = useSession(false);

  return (
    <AuthContext.Provider value={session}>{children}</AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
