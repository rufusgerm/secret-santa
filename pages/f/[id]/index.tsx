import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { FamilyIdOnly } from "pages/api/read/all-families";
import GetFamilyById, { FamilyInfo } from "pages/api/read/family-by-id";

export const getStaticPaths: GetStaticPaths = async () => {
  const allFamilyIds = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER}/api/read/all-families`,
    {
      method: "GET",
    }
  );

  const families = (await allFamilyIds.json()) as FamilyIdOnly[];

  const paths = families.map((f: FamilyIdOnly) => ({
    params: { id: f.id },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id as string;
  let family: FamilyInfo | null;

  family = await GetFamilyById(id);

  return { props: { family } };
};

export default function Family({ family }: { family: FamilyInfo | null }) {
  return (
    <div>
      <h1>The {family?.name} Family</h1>

      <div>
        <ol>
          {family?.SantasOnFamilies.map((s) => (
            <li key={`${s.santa_id}`}>
              <Link href={`/s/${s.santa_id}`}>
                {`${s.santa.first_name} ${s.santa.last_name}`}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
