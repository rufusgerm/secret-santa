import { Santa } from ".prisma/client";
import { santaId, SantaIdOnly } from "@lib/types";
import prisma from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function createSanta(
  req: NextApiRequest,
  res: NextApiResponse<SantaIdOnly | string>
) {
  const { body, method } = req;

  let response: { status: number; payload: SantaIdOnly | string } = {
    status: 500,
    payload: "Something went wrong on the server. Please try again later!",
  };

  if (method !== "POST")
    response = {
      status: 405,
      payload: "Invalid HTTP Method! Not allowed.",
    };

  const newSanta: Santa = JSON.parse(body);

  const checkSanta: Santa | null = await prisma.santa.findUnique({
    where: {
      email: newSanta.email,
    },
  });

  if (checkSanta)
    response = {
      status: 403,
      payload: "User with that email already exists!",
    };

  const savedSanta: SantaIdOnly = await prisma.santa.create({
    data: newSanta,
    select: santaId,
  });

  if (savedSanta) response = { status: 200, payload: savedSanta };

  return res.status(response.status).json(response.payload);
}
