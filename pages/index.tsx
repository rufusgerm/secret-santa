import { Family } from ".prisma/client";
import prisma from "lib/prisma";
import { GetServerSideProps } from "next";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const families: Family[] = await prisma.family.findMany();
  return {
    props: {
      FamilyMemberList: families,
    },
  };
};

export default function Home({
  FamilyMemberList,
}: {
  FamilyMemberList: Family[];
}) {
  return (
    <div>
      <h1>Welcome to Simple Santa</h1>
      {FamilyMemberList.map((f: Family) => (
        <h1 key={`${f.name}-${f.created_at}`}>{f.name}</h1>
      ))}
      <Link href="s/create" passHref>
        <button>Click Here to Create!</button>
      </Link>
      <div>
        <form onSubmit={(e) => false}>
          <label>Email</label>
          <input defaultValue="" />
          <button type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
}
