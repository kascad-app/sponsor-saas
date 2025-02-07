import { Button } from "@/src/components/ui/button";
import { ROUTES } from "@/src/shared/constants/ROUTES";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1 className="text-5xl">KASCAD RIDER</h1>
      <Button asChild>
        <Link href={ROUTES.APP.DASHBOARD}>dashboard</Link>
      </Button>
    </>
  );
}
