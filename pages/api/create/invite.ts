import { Santa, TempAccount } from ".prisma/client";
import prisma from "lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function createInvite(
  req: NextApiRequest,
  res: NextApiResponse<TempAccount | string>
) {
  const { body, method } = req;

  // Assume the worst!
  let response: { status: number; payload: TempAccount | string } = {
    status: 500,
    payload: "Something went wrong on the server. Please try again later!",
  };

  if (method !== "POST")
    response = {
      status: 405,
      payload: "Invalid HTTP Method! Not allowed.",
    };

  const newInvite: TempAccount = JSON.parse(body);

  const checkSanta: Santa | null = await prisma.santa.findUnique({
    where: {
      email: newInvite.email,
    },
  });

  if (checkSanta)
    response = {
      status: 403,
      payload: "User with that email already exists!",
    };

  const checkTempAccount: TempAccount | null =
    await prisma.tempAccount.findUnique({
      where: {
        email: newInvite.email,
      },
    });

  if (checkTempAccount)
    response = {
      status: 403,
      payload: "User with that email already exists!",
    };

  const newTempAcct: TempAccount = await prisma.tempAccount.create({
    data: newInvite,
  });

  if (newTempAcct)
    response = {
      status: 200,
      payload: newTempAcct,
    };

  return res.status(response.status).json(response.payload);
}
