import { AnswerInfo } from "@lib/types";
import { parseQueryString } from "@lib/utils/validationCheckers";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@lib/prisma";

export default async function GetAnswer(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    query: { id, santaId, questionId },
  } = req;

  if (method !== "GET")
    return res
      .status(405)
      .json({ message: "Invalid HTTP Method! Not allowed." });
  if (id) {
    const answer: AnswerInfo | null = await getAnswerById(id);
    if (answer) return res.status(200).json(answer);
    return res.json({ message: "Answer with that id not found!" });
  }
  if (santaId) {
    const answers: AnswerInfo[] = await getAnswersBySantaId(santaId);
    if (answers.length > 0) return res.status(200).json(answers);
    return res.json({ message: "Answers with that santa id not found!" });
  }
  if (questionId) {
    const answers: AnswerInfo[] | null = await getAnswersByQuestionId(
      questionId
    );
    if (answers) return res.status(200).json(answers);
    return res.json({ message: "Answers with that question id not found!" });
  }
  return res.status(400).json({ message: "Invalid request!" });
}

const getAnswerById = async (
  id: string | string[]
): Promise<AnswerInfo | null> => {
  const { parsedId, isIdValid } = parseQueryString(id);
  if (isIdValid)
    return await prisma.answer.findUnique({
      where: {
        id: parsedId!,
      },
      include: {
        question: true,
      },
    });
  return null;
};

const getAnswersBySantaId = async (
  id: string | string[]
): Promise<AnswerInfo[]> => {
  return await prisma.answer.findMany({
    where: {
      santa_id: id as string,
    },
    include: {
      question: true,
    },
  });
};

const getAnswersByQuestionId = async (
  id: string | string[]
): Promise<AnswerInfo[] | null> => {
  const { parsedId, isIdValid } = parseQueryString(id);
  if (isIdValid)
    return await prisma.answer.findMany({
      where: {
        question_id: parsedId,
      },
      include: {
        question: true,
      },
    });
  return null;
};
