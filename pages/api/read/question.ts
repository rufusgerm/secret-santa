import { Question } from ".prisma/client";
import prisma from "@lib/prisma";
import { EndpointResponse, QuestionInfo } from "@lib/types";
import { parseQueryString } from "@lib/utils/validationCheckers";
import { NextApiRequest, NextApiResponse } from "next";

export default async function GetQuestion(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query, method } = req;

  if (method !== "GET")
    return res
      .status(405)
      .json({ message: "Invalid HTTP Method! Not allowed." });
  if (query.id) {
    const question: QuestionInfo | null = await getQuestionById(query.id);
    if (question) return res.json(question);
    return res.status(404).json({ message: "No question found!" });
  } else if (query.familyId) {
    const questions: QuestionInfo[] = await getQuestionsByFamilyId(
      query.familyId
    );

    if (questions.length !== 0) return res.json(questions);

    return res.status(404).json({ message: "No questions" });
  }
  return res.status(400).json({ message: "Invalid request!" });
}

const getQuestionById = async (
  id: string | string[]
): Promise<QuestionInfo | null> => {
  const { parsedId, isIdValid } = parseQueryString(id);

  if (isIdValid) {
    return await prisma.question.findUnique({
      where: {
        id: parsedId!,
      },
    });
  }
  return null;
};

const getQuestionsByFamilyId = async (
  familyId: string | string[]
): Promise<QuestionInfo[]> => {
  return await prisma.question.findMany({
    where: {
      family_id: familyId as string,
    },
  });
};
