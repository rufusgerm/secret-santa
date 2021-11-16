import { Prisma } from ".prisma/client";
import useSanta from "@lib/useSanta";
import { isValidEmail } from "@lib/utils/email";
import { generateVerificationCode } from "@lib/utils/verification";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { FamilyIdOnly, FamilyInfo } from "pages/api/read/family";
import { FormEvent, useState } from "react";

export const getStaticPaths: GetStaticPaths = async () => {
  const allFamilyIds = (await fetch(
    `${process.env.NEXT_PUBLIC_SERVER}/api/read/family`
  )
    .then((r) => r.json())
    .catch((err) => console.error(err))) as FamilyIdOnly[];

  const paths = allFamilyIds.map((f: FamilyIdOnly) => ({
    params: { id: f.id },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id as string;
  let family: FamilyInfo | null;

  family = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER}/api/read/family?id=${id}`
  )
    .then((r) => r.json())
    .catch((err) => console.error(err));

  return { props: { family } };
};

export default function Family({ family }: { family: FamilyInfo | null }) {
  const { santa } = useSanta();
  const [email, setEmail] = useState<string>("");

  const { isFamilyMember, isMemberAdmin } = santaOnFamily(
    santa?.id as string,
    family
  );

  const handleInvite = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValidEmail(email)) console.log("Invalid email!");

    const tempAcct: Prisma.TempAccountCreateInput = {
      email: email,
      verification_code: generateVerificationCode(),
    };
  };

  return (
    <div>
      <h1>The {family?.name} Family</h1>
      {isFamilyMember ? (
        <div>
          {isMemberAdmin && <h1>edit</h1>}
          <div>
            <ol>
              {family?.SantasOnFamilies.map((s) => {
                return (
                  <li key={`${s.santa_id}`}>
                    <Link href={`/s/${s.santa_id}`}>
                      {`${s.santa.first_name} ${s.santa.last_name}`}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
          <div>
            <form onSubmit={handleInvite}>
              <label>Invite someone to this family</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email"
              />
            </form>
          </div>
          <button>Send Invite</button>
        </div>
      ) : (
        <div>
          <h1>Sorry! You&apos;re not a part of this family yet!</h1>
        </div>
      )}
    </div>
  );
}

const santaOnFamily = (
  id: string,
  family: FamilyInfo | null
): { isFamilyMember: boolean; isMemberAdmin: boolean } => {
  const santa = family?.SantasOnFamilies.find((s) => s.santa_id == id);
  let isFamilyMember = !!santa;

  let isMemberAdmin = isFamilyMember && !!santa?.santa_is_admin;

  return { isFamilyMember, isMemberAdmin };
};
