"use client";

import { Button } from "@/src/components/ui/button";
import {
  useLogin,
  useLogout,
} from "@/src/entities/authentication/authentication.hooks";
import useSession from "@/src/shared/api/use-session";
import { ROUTES } from "@/src/shared/constants/ROUTES";
import Link from "next/link";

export default function Home() {
  const session = useSession(false);
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const handleLogout = () => session.loggedIn && logoutMutation.trigger();
  const handleLogin = () =>
    loginMutation.trigger({
      email: "lucas@test.com",
      password: "Ouiouioui1",
    });

  return (
    <>
      <h1 className="text-5xl">KASCAD sponsor</h1>
      <Button asChild>
        <Link href={ROUTES.APP.DASHBOARD}>dashboard</Link>
      </Button>

      <p>TEST AUTH</p>
      <Button
        variant={"secondary"}
        onClick={handleLogin}
        disabled={loginMutation.isMutating}
      >
        {loginMutation.isMutating ? "Logging in..." : "Login sponsor"}
      </Button>
      <Button
        variant={"outline"}
        onClick={handleLogout}
        disabled={logoutMutation.isMutating}
      >
        {logoutMutation.isMutating ? "Logging out..." : "Logout sponsor"}
      </Button>
      {session.loggedIn && <h2>User logged</h2>}

      {loginMutation.error && <p>Error: {loginMutation.error.message}</p>}
    </>
  );
}
