import { Prisma } from ".prisma/client";
import { InformationCircleIcon } from "@heroicons/react/solid";
import useSanta, { fetcher } from "@lib/hooks/useSanta";
import { FamilyIdOnly, FamilyInfo, QuestionInfo } from "@lib/types";
import FamilyMemberList, {
  FamilyMemberCard,
  FamilyMemberAnswers,
} from "components/FamilyMemberList";
import { FamilyRulesCard } from "components/FamilyRulesCard";
import InviteForm from "components/InviteForm";
import { GetStaticPaths, GetStaticProps } from "next";
import React, { FormEvent, useState } from "react";
import useSWR from "swr";

export const getStaticPaths: GetStaticPaths = async () => {
  const allFamilyIds = (await fetch(
    `${process.env.NEXT_PUBLIC_ABS_API_READ}/family`
  )
    .then((r) => r.json())
    .catch((err) => console.error(err))) as FamilyIdOnly[];

  const paths = allFamilyIds.map((f: FamilyIdOnly) => ({
    params: { id: f.id },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id as string;

  let family: FamilyInfo | null = await fetch(
    `${process.env.NEXT_PUBLIC_ABS_API_READ}/family?id=${id}`
  )
    .then((r) => r.json())
    .catch((err) => console.error(err));

  return { props: { family } };
};

export default function Family({ family }: { family: FamilyInfo | null }) {
  const { santa, isLoading } = useSanta();
  const { mutate: mutateQuestions } = useSWR<QuestionInfo[]>(
    `/api/read/question?familyId=${family?.id}`,
    fetcher
  );
  const { data: familyData } = useSWR<FamilyInfo>(
    `/api/read/family?id=${family?.id}`,
    fetcher
  );

  const [menuItem, setMenuItem] = useState<boolean>(false);

  const { isViewerFamily, isViewerAdmin } = santaOnFamily(
    santa?.id as string,
    family
  );

  const handleQAdd = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const questionText = (
      e.currentTarget.elements.namedItem("question") as HTMLInputElement
    ).value;

    if (!questionText) return false;

    const newQuestion: Prisma.QuestionUncheckedCreateInput = {
      text: questionText,
      family_id: family!.id,
    };

    const savedQuestion = await fetch("/api/create/question", {
      method: "POST",
      body: JSON.stringify(newQuestion),
    })
      .then((r) => r.json())
      .catch((err) => console.error(err));

    if (savedQuestion) mutateQuestions();
  };

  return (
    !isLoading && (
      <div className="flex flex-col my-2">
        <div className="mt-2 flex flex-row justify-center">
          <h1 className="w-full flex flex-row justify-center text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="flex flex-row">
              The {family?.name} Family{" "}
              {isViewerAdmin && (
                <InformationCircleIcon className="my-auto mx-4 w-8 h-8" />
              )}
            </span>
          </h1>
        </div>
        {isViewerFamily ? (
          <div className="">
            <div className="mt-6 mb-2 flex justify-center">
              <div className="mt-8 flex justify-evenly w-1/2 lg:mt-0 lg:flex-shrink-0">
                <div className="inline-flex rounded-md shadow">
                  <a
                    onClick={(e) => setMenuItem(false)}
                    className={`inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md cursor-pointer ${
                      !menuItem
                        ? "text-white bg-[#146B3A] hover:bg-[#165B33]"
                        : 'text-[#146B3A] bg-white hover:bg-gray-100"'
                    } `}
                  >
                    Family Rules
                  </a>
                </div>
                <div className="ml-3 inline-flex rounded-md shadow">
                  <a
                    onClick={(e) => setMenuItem(true)}
                    className={`inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white cursor-pointer ${
                      menuItem
                        ? "text-white bg-[#146B3A] hover:bg-[#165B33]"
                        : 'text-[#146B3A] bg-white hover:bg-gray-100"'
                    } `}
                  >
                    Members
                  </a>
                </div>
              </div>
            </div>
            <div>
              {!menuItem ? (
                <FamilyRulesCard>
                  {family?.rules && family.rules.length > 0
                    ? family?.rules
                    : `The ${family?.name} family hasn't set their rules yet!`}
                </FamilyRulesCard>
              ) : (
                <FamilyMemberList>
                  {familyData?.SantasOnFamilies.filter(
                    (s) => s.santa_id !== santa?.id
                  ).map((s, idx) => {
                    return (
                      <FamilyMemberCard
                        key={s.santa_id}
                        id={s.santa_id}
                        firstName={s.santa.first_name}
                        lastName={s.santa.last_name}
                        isViewerAdmin={isViewerAdmin}
                      >
                        {family?.Questions.map((q, idx) => {
                          const answer = s.santa.Answers.find(
                            (a) => a.question_id === q.id
                          );
                          return (
                            <FamilyMemberAnswers
                              key={`${s.santa_id}-${q.id}`}
                              question={q.text}
                              answer={
                                answer?.text ||
                                `${s.santa.first_name} has not answered that question yet!`
                              }
                              rowColor={
                                idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                              }
                            />
                          );
                        })}
                      </FamilyMemberCard>
                    );
                  })}
                </FamilyMemberList>
              )}
            </div>
            <InviteForm familyId={family!.id} />
          </div>
        ) : (
          <div>
            <h1>Sorry! You&apos;re not a part of this family yet!</h1>
          </div>
        )}
      </div>
    )
  );
}

const santaOnFamily = (
  id: string,
  family: FamilyInfo | null
): { isViewerFamily: boolean; isViewerAdmin: boolean } => {
  const santa = family?.SantasOnFamilies.find((s) => s.santa_id == id);
  let isViewerFamily = !!santa;

  let isViewerAdmin = isViewerFamily && !!santa?.santa_is_admin;

  return { isViewerFamily, isViewerAdmin };
};

const AddQuestion = ({ addQHandler }: { addQHandler: any }): JSX.Element => {
  return (
    <form onSubmit={addQHandler}>
      <input name="question" type="text" />
      <button>Add Question</button>
    </form>
  );
};
