import { Prisma } from ".prisma/client";
import prisma from "@shared/prisma";

const santaDetail = Prisma.validator<Prisma.SantaSelect>()({
  first_name: true,
  coupled_with_id: true,
  SantasOnFamilies: {
    select: {
      family_id: true,
      family: {
        select: {
          name: true,
        },
      },
    },
  },
});
export type SantaInfo = Prisma.SantaGetPayload<{
  select: typeof santaDetail;
}>;

export default async function GetSantaById(id: string) {
  const santa: SantaInfo | null = await prisma.santa.findUnique({
    where: { id: id },
    select: santaDetail,
  });

  return santa;
}
