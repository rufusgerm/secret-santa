import { useEffect } from "react";
import Router from "next/router";
import useSWR from "swr";
import { SantaSession } from "pages/api/session";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function useSanta({
  redirectTo = "",
  redirectIfFound = false,
} = {}) {
  const { data: santa, mutate: mutateSanta } = useSWR<SantaSession>(
    "/api/session",
    fetcher
  );
  useEffect(() => {
    // if no redirect needed, just return (example: already on /dashboard)
    // if santa data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if (!redirectTo || !santa) return;

    if (
      // If redirectTo is set, redirect if the santa was not found.
      (redirectTo && !redirectIfFound && !santa?.isLoggedIn) ||
      (redirectIfFound && santa?.isLoggedIn)
    ) {
      Router.push(`${redirectTo}/${santa.id}`);
    }
    // if (redirectIfFound && santa?.isLoggedIn && redirectTo) {
    //   console.log(`Found...redirecting to...${redirectTo}/${santa.id}`);
    //   Router.push(`${redirectTo}/${santa.id}`);
    // }
  }, [santa, redirectIfFound, redirectTo]);

  return { santa, mutateSanta };
}
