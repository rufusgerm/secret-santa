import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { SantaIdOnly } from "pages/api/read/all-santas";
import GetSantaById from "pages/api/read/santa-by-id";

export const getStaticPaths: GetStaticPaths = async () => {
  const allSantaIds = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER}/api/read/all-santas`,
    {
      method: "GET",
    }
  );

  const santas = await allSantaIds.json();

  const paths = santas.map((s: SantaIdOnly) => ({
    params: { id: s.id },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id as string;
  let santa;

  if (id) santa = await GetSantaById(id);

  return { props: { santa } };
};

export default function Santa({
  santa,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  console.log({ santa });
  return (
    <div>
      <h1>{santa?.first_name || "Santa"}</h1>
    </div>
  );
}
