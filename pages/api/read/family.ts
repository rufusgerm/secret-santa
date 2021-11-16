import { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import { Prisma } from ".prisma/client";

const familyId = Prisma.validator<Prisma.FamilySelect>()({
  id: true,
});

export type FamilyIdOnly = Prisma.SantaGetPayload<{
  select: typeof familyId;
}>;

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
      santa_is_admin: true,
    },
  },
});

export type FamilyInfo = Prisma.FamilyGetPayload<{
  select: typeof familyDetail;
}>;

export default async function Family(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
  } = req;

  if (method !== "GET")
    return res
      .status(405)
      .json({ message: "Invalid HTTP Method! Not allowed." });

  if (id) res.json(await family(id as string));

  if (!id) res.json(await families());
}

const family = async (id: string): Promise<FamilyInfo | null> => {
  return await prisma.family.findUnique({
    where: { id: id },
    select: familyDetail,
  });
};

const families = async (): Promise<FamilyIdOnly[]> => {
  return await prisma.family.findMany({
    select: familyId,
  });
};
