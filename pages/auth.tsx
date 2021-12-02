import useSanta from "@lib/hooks/useSanta";
import { GetServerSideProps } from "next";
import { useEffect } from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;

  if (!query.seal)
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };

  return {
    props: { seal: query.seal },
  };
};

export default function Auth({ seal }: { seal: string }) {
  let { mutateSanta } = useSanta({ redirectTo: "/s", redirectIfFound: true });

  useEffect(() => {
    async function authSanta() {
      const response = await fetch(`/api/authenticate?seal=${seal}`, {
        method: "POST",
      });

      mutateSanta(await response.json());
    }

    authSanta();
  });

  return null;
}
