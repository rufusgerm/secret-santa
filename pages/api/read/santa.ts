import {
  EndpointResponse,
  santaDetail,
  santaId,
  SantaIdOnly,
  SantaInfo,
} from "@lib/types";
import { Santa } from "@prisma/client";
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

  let response: EndpointResponse<SantaInfo, SantaIdOnly[], Santa> = {
    status: 500,
    payload: "Something went wrong on the server. Please try again later!",
  };

  if (method !== "GET")
    response = {
      status: 405,
      payload: "Invalid HTTP Method! Not allowed.",
    };

  if (id) {
    const santa: SantaInfo | null = await santaById(id as string);

    if (!santa)
      response = {
        status: 404,
        payload: "Santa with that Id not found!",
      };

    response = {
      status: 200,
      payload: santa!,
    };
  }

  if (!id) {
    const santas = await santasAll();
    if (!santas)
      response = {
        status: 500,
        payload: "Something went wrong on the server. Please try again later!",
      };
    response = {
      status: 200,
      payload: santas,
    };
  }

  return res.status(response.status).json(response.payload);
}

const santaById = async (id: string): Promise<SantaInfo | null> => {
  return await prisma.santa.findUnique({
    where: { id: id },
    select: santaDetail,
  });
};

const santasAll = async (): Promise<SantaIdOnly[]> => {
  return await prisma.santa.findMany({
    select: santaId,
  });
};
