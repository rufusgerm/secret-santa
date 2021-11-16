import useSanta from "@lib/useSanta";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { SantaIdOnly, SantaInfo } from "pages/api/read/santa";

export const getStaticPaths: GetStaticPaths = async () => {
  const santas = await fetch(`${process.env.NEXT_PUBLIC_SERVER}/api/read/santa`)
    .then((r) => r.json())
    .catch((err) => console.error(err));

  const paths = santas.map((s: SantaIdOnly) => ({
    params: { id: s.id },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id as string;

  const santa = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER}/api/read/santa?id=${id}`
  )
    .then((r) => r.json())
    .catch((err) => console.error(err));

  return { props: { santa } };
};

export default function Santa({ santa }: { santa: SantaInfo | null }) {
  const { santa: santaData } = useSanta();

  const isAuthSantaProfile = santaData?.id == santa?.id;

  return (
    <div>
      <div>
        <h1>{santa?.first_name}</h1>
        {isAuthSantaProfile && <a>Edit Details</a>}
      </div>
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
