import { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import { Prisma } from ".prisma/client";

const familyId = Prisma.validator<Prisma.FamilySelect>()({
  id: true,
});

export type FamilyIdOnly = Prisma.SantaGetPayload<{
  select: typeof familyId;
}>;

export default async function AllFamilyIds(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
    return res
      .status(405)
      .json({ message: "Invalid HTTP Method! Not allowed." });

  const families: FamilyIdOnly[] = await prisma.family.findMany({
    select: familyId,
  });

  res.json(families);
}
