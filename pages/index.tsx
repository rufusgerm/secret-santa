import { Family, Santa } from ".prisma/client";
import prisma from "lib/prisma";
import { GetServerSideProps } from "next";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const families: Family[] = await prisma.family.findMany();
  return {
    props: {
      familyList: families,
    },
  };
};

export default function Home({ familyList }: { familyList: Family[] }) {
  return (
    <div>
      <h1>Secret Santa Site!</h1>
      {familyList.map((f: Family) => (
        <h1 key={`${f.name}-${f.created_at}`}>{f.name}</h1>
      ))}
      <Link href="s/create" passHref>
        <button>Click Here to Create!</button>
      </Link>
      <div>
        <form onSubmit={(e) => false}>
          <label>Email</label>
          <input value="" />
          <button type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
}
