import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { SantaIdOnly } from "pages/api/read/all-santas";
import GetSantaById, { SantaInfo } from "pages/api/read/santa-by-id";

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER}/api/read/all-santas`
  );

  const santas = await response.json();

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
  let santa: SantaInfo | null;

  santa = await GetSantaById(id);

  return { props: { santa } };
};

export default function Santa({ santa }: { santa: SantaInfo | null }) {
  return (
    <div>
      <h1>{santa?.first_name}</h1>
      <h1>Families</h1>
      {santa?.SantasOnFamilies.length === 0 ? (
        <h3>You don&apos;t have any families yet!</h3>
      ) : (
        <div>
          <ol>
            {santa?.SantasOnFamilies.map((f) => (
              <li key={`${f.family_id}`}>
                <Link href={`/f/${f.family_id}`}>{f.family.name}</Link>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
