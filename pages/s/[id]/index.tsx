import useSanta from "@lib/hooks/useSanta";
import { SantaIdOnly, SantaInfo } from "@lib/types";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";

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
    <div
      style={{
        color: "blue",
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <div
        style={{
          margin: "auto",
          width: "33%",
        }}
      >
        <h1 style={{ textAlign: "center" }}>{santa?.first_name}</h1>
        {isAuthSantaProfile && (
          <h3 style={{ textAlign: "center" }}>Edit Details</h3>
        )}
      </div>
      <div
        style={{
          margin: "auto",
          width: "33%",
          alignItems: "center",
        }}
      >
        <h1 style={{ textAlign: "center" }}>Families</h1>
        {santa?.SantasOnFamilies.length === 0 ? (
          <h3 style={{ textAlign: "center" }}>
            You don&apos;t have any families yet!
          </h3>
        ) : (
          <div style={{ alignItems: "center" }}>
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
    </div>
  );
}
