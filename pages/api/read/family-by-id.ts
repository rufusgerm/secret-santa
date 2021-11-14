import { Prisma } from ".prisma/client";
import prisma from "lib/prisma";

const familyDetail = Prisma.validator<Prisma.FamilySelect>()({
  id: true,
  name: true,
  SantasOnFamilies: {
    select: {
      santa_id: true,
      santa: {
        select: {
          first_name: true,
          last_name: true,
        },
      },
    },
  },
});

export type FamilyInfo = Prisma.FamilyGetPayload<{
  select: typeof familyDetail;
}>;

export default async function GetFamilyById(id: string) {
  const family: FamilyInfo | null = await prisma.family.findUnique({
    where: { id: id },
    select: familyDetail,
  });

  console.log({ family });

  return family;
}
