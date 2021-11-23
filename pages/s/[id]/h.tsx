import useSanta from "@lib/hooks/useSanta";
import router from "next/router";
import { useEffect } from "react";

export default function SantaHome(): JSX.Element {
  const { santa, isLoading } = useSanta();

  useEffect(() => {
    if (!santa?.isLoggedIn) router.push("/login");
  }, [santa]);

  return isLoading ? (
    <div>
      <h1>Loading</h1>
    </div>
  ) : santa?.isLoggedIn ? (
    <div>
      <h1>Logged In</h1>
    </div>
  ) : (
    <div>Unauthorized!</div>
  );
}
