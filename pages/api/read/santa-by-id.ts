import { Prisma } from ".prisma/client";
import prisma from "@shared/prisma";

const santaDetail = Prisma.validator<Prisma.SantaArgs>()({
  select: { first_name: true, coupled_with_id: true },
});

export type SantaInfo = Prisma.SantaGetPayload<typeof santaDetail>;

export default async function GetSantaById(id: string) {
  const santa = await prisma.santa.findUnique({
    where: { id: id },
    include: { SantasOnFamilies: true },
  });

  console.log({ santa });

  return santa;
}
