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
import { getFamilies, getFamilyById } from "pages/api/read/family";
import React, { FormEvent, useState } from "react";
import useSWR from "swr";

export const getStaticPaths: GetStaticPaths = async () => {
  const allFamilyIds = await getFamilies();

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

  let family: FamilyInfo | null = await getFamilyById(id);

  return {
    props: { family },
    revalidate: 60,
  };
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

  const [menuItem, setMenuItem] = useState<boolean>(true);
  const [showMemberIdAnswers, setShowMemberIdAnswers] = useState<string>("");

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
          <h1 className="w-full flex flex-row justify-center text-3xl tracking-tight font-extrabold text-[#165B33] sm:text-5xl md:text-6xl">
            <span className="flex flex-row">
              The {family?.name} Family{" "}
              {/* {isViewerAdmin && (
                <InformationCircleIcon className="my-auto mx-4 w-8 h-8" />
              )} */}
            </span>
          </h1>
        </div>
        {isViewerFamily ? (
          <div>
            <div className="sm:mt-6 sm:mb-2 flex justify-center">
              <div className="mt-4 flex justify-around lg:justify-evenly sm:mt-0 lg:flex-shrink-0 w-3/4">
                <div className="inline-flex mr-2 rounded-md shadow">
                  <a
                    onClick={(e) => setMenuItem(true)}
                    className={`inline-flex items-center justify-center px-5 py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white cursor-pointer ${
                      menuItem
                        ? "text-white bg-[#146B3A] hover:bg-[#165B33]"
                        : "text-[#146B3A] bg-white hover:bg-gray-100"
                    } `}
                  >
                    Members
                  </a>
                </div>
                <div className="inline-flex rounded-md shadow">
                  <a
                    onClick={(e) => setMenuItem(false)}
                    className={`inline-flex items-center justify-center px-5 py-3 border border-transparent text-sm sm:text-base font-medium rounded-md cursor-pointer ${
                      !menuItem
                        ? "text-white bg-[#146B3A] hover:bg-[#165B33]"
                        : "text-[#146B3A] bg-white hover:bg-gray-100"
                    } `}
                  >
                    Family Rules
                  </a>
                </div>
              </div>
            </div>
            <div className="h-auto">
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
                        setVisible={setShowMemberIdAnswers}
                        areAnswersVisible={showMemberIdAnswers == s.santa_id}
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
            <InviteForm
              inviteSenderName={santa!.first_name}
              familyId={family!.id}
            />
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
