import { NextApiRequest, NextApiResponse } from "next";
import prisma from "lib/prisma";
import { Prisma } from ".prisma/client";

const santaId = Prisma.validator<Prisma.SantaSelect>()({
  id: true,
});

export type SantaIdOnly = Prisma.SantaGetPayload<{
  select: typeof santaId;
}>;

const santaDetail = Prisma.validator<Prisma.SantaSelect>()({
  id: true,
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
      santa_is_admin: true,
    },
  },
});

export type SantaInfo = Prisma.SantaGetPayload<{
  select: typeof santaDetail;
}>;

export default async function AllSantaIds(
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

  if (id) res.json(await santa(id as string));

  if (!id) res.json(await santas());
}

const santa = async (id: string): Promise<SantaInfo | null> => {
  return await prisma.santa.findUnique({
    where: { id: id },
    select: santaDetail,
  });
};

const santas = async (): Promise<SantaIdOnly[]> => {
  return await prisma.santa.findMany({
    select: santaId,
  });
};
