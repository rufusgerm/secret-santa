import { FamilyInfo, familyDetail, FamilyIdOnly, familyId } from "@lib/types";
import prisma from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function GetFamily(
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

  if (id) return res.json(await getFamilyById(id as string));

  if (!id) return res.json(await getFamilies());
}

const getFamilyById = async (id: string): Promise<FamilyInfo | null> => {
  // TODO: This isn't handled right. There is no check for null; the user
  // should know that the family id didn't return a record
  return await prisma.family.findUnique({
    where: { id: id },
    select: familyDetail,
  });
};

const getFamilies = async (): Promise<FamilyIdOnly[]> => {
  // TODO: This isn't handled right. There is no check for an empty array (i.e. no records found);
  // the user should know that no records were found
  return await prisma.family.findMany({
    select: familyId,
  });
};
