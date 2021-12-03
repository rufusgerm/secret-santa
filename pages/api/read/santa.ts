import {
  santaDetail,
  santaId,
  SantaIdOnly,
  SantaInfo
} from "@lib/types";
import prisma from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function GetSanta(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
  } = req;

  if (method !== "GET")
    return res.status(405).json({message: "Invalid HTTP Method! Not allowed."})

  if (id) {
    const santa: SantaInfo | null = await getSantaById(id as string);

    if (!santa)
      return res.status(404).json({message: "Santa with that Id not found!"})

    return res.status(200).json(santa);
  }
  
  const santas = await getSantas();
    
  if (santas)
    return res.status(200).json(santas);

  return res.status(500).json({message: "Something went wrong! Please try again later!"});
}

export const getSantaById = async (id: string): Promise<SantaInfo | null> => {
  return await prisma.santa.findUnique({
    where: { id: id },
    select: santaDetail,
  });
};

export const getSantas = async (): Promise<SantaIdOnly[]> => {
  return await prisma.santa.findMany({
    select: santaId,
  });
};
