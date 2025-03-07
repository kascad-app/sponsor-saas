"use client";

import { Button } from "@/src/components/ui/button";
import { AuthenticationAPI } from "@/src/entities/authentication";
import useSession from "@/src/shared/api/use-session";
import { ROUTES } from "@/src/shared/constants/ROUTES";
import { ProfileType } from "@kascad-app/shared-types";
import Link from "next/link";

export default function Home() {
  const session = useSession();

  const handleLogin = () => {
    AuthenticationAPI.login({
      email: "lucas@test.com",
      password: "Very good password123",
      type: ProfileType.SPONSOR,
    });
  };

  const handleLogout = () => session.loggedIn && session.signOut();

  return (
    <>
      <h1 className="text-5xl">KASCAD sponsor</h1>
      <Button asChild>
        <Link href={ROUTES.APP.DASHBOARD}>dashboard</Link>
      </Button>
      <Link href="/test-auth">
        <p>test protected route</p>
      </Link>
      <p>TEST AUTH</p>
      <Button variant={"secondary"} onClick={handleLogin}>
        Login sponsor
      </Button>
      <Button variant={"outline"} onClick={handleLogout}>
        logout sponsor
      </Button>
      {session.loggedIn && <h2>User logged</h2>}
    </>
  );
}
