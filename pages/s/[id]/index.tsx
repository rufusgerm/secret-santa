import { Prisma } from ".prisma/client";
import useSanta, { fetcher } from "@lib/hooks/useSanta";
import { AnswerInfo, SantaIdOnly, SantaInfo } from "@lib/types";
import { isValidObject } from "@lib/utils/validationCheckers";
import { FamilyList, FamilyListCard } from "components/FamilyList";
import {
  EmptyQuestionAnswerListCard,
  QuestionAnswerListCard,
  QuestionAnswerListItem
} from "components/QuestionAnswerList";
import { GetStaticPaths, GetStaticProps } from "next";
import { getSantaById, getSantas } from "pages/api/read/santa";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

export const getStaticPaths: GetStaticPaths = async () => {
  const santas = await getSantas();

  const paths = santas.map((s: SantaIdOnly) => ({
      params: { id: s.id },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id as string;

  const santa = await getSantaById(id);

  return {
    props: { santa },
    revalidate: 60
  };
};

type QuestionAnswer = {
  id: number;
  santa_id: string;
  text: string;
  question: {
    id: number;
    family_id: string;
    text: string;
  };
};

export default function Santa({
  santa,
}: {
  santa: SantaInfo | null;
}): JSX.Element {
  const { santa: santaSession, isLoading } = useSanta({ redirectTo: "/login" });
  const { data: answers, mutate } = useSWR<AnswerInfo[]>(
    `/api/read/answer?santaId=${santa?.id}`,
    fetcher
  );
  const [chosenFamily, setChosenFamily] = useState<{
    id: string;
    name: string;
  }>({ id: "", name: "" });
  const [questionAnswerList, setQuestionAnswerList] =
    useState<QuestionAnswer[]>();

  useEffect(() => {
    const { id, name } = chosenFamily;
    if (id && name) {
      const filteredAnswers =
        answers && answers.length > 0
          ? answers?.filter((a) => a.question.family_id === id)
          : [];
      setQuestionAnswerList(filteredAnswers);
    }
  }, [chosenFamily, answers]);

  const handleFamilyClick = (familyId: string, familyName: string): void => {
    if (familyId && familyName)
      setChosenFamily({ id: familyId, name: familyName });
  };

  const handleAnswerEdit = async (
    answerId: number,
    newAnswer: string,
    questionId: number
  ) => {
    let response;
    if (answerId > 0) {
      response = await fetch("/api/update/answer", {
        method: "PUT",
        body: JSON.stringify({ id: answerId, text: newAnswer }),
      });
    } else {
      const answer: Prisma.AnswerUncheckedCreateInput = {
        text: newAnswer,
        question_id: questionId,
        santa_id: santa!.id,
      };

      response = await fetch("/api/create/answer", {
        method: "POST",
        body: JSON.stringify(answer),
      });
    }

    if (response.ok) {
      mutate();
    }
  };

  return isLoading ? (
    <div>
      <h1>Loading</h1>
    </div>
  ) : santaSession?.isLoggedIn ? (
    <div className="w-full flex flex-col">
      <div className="my-2 flex flex-row justify-center">
        <h1 className="w-full flex flex-row justify-center text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          <span className="flex flex-row">
            {`${santaSession?.first_name}'s Homepage`}
          </span>
        </h1>
      </div>
      <div className="w-7/12 mx-auto my-4 flex flex-row">
        <div className="flex flex-row justify-center w-1/3">
          <FamilyList>
            {santa?.SantasOnFamilies.map((s) => {
              return (
                <FamilyListCard
                  key={`${santa.id}-${s.family.id}`}
                  santaId={santa.id}
                  family={{ id: s.family.id, name: s.family.name }}
                  handleClick={handleFamilyClick}
                />
              );
            })}
          </FamilyList>
        </div>
        <div className="w-2/3 flex flex-col">
          {isValidObject(questionAnswerList) ? (
            <QuestionAnswerListCard familyName={chosenFamily.name}>
              {santa?.SantasOnFamilies.find(
                (f) => f.family.id === chosenFamily.id
              )?.family.Questions.map((q, idx) => {
                const answer = questionAnswerList!.find(
                  (a) => a.question.id === q.id
                );
                return (
                  <QuestionAnswerListItem
                    key={`${santa.id}-${q.id}`}
                    question={{ text: q.text, id: q.id }}
                    answer={
                      isValidObject(answer)
                        ? { id: answer!.id, text: answer!.text }
                        : {
                            id: -1,
                            text: "You have not answered this question yet!",
                          }
                    }
                    rowColor={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    editAnswer={handleAnswerEdit}
                  />
                );
              })}
            </QuestionAnswerListCard>
          ) : (
            <EmptyQuestionAnswerListCard />
          )}
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}
