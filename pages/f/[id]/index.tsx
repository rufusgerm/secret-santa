import { Prisma } from ".prisma/client";
import useSanta, { fetcher } from "@lib/hooks/useSanta";
import { FamilyIdOnly, FamilyInfo, QuestionInfo } from "@lib/types";
import FamilyList, {
  FamilyMember,
  FamilyMemberAnswers,
} from "components/FamilyList";
import InviteForm from "components/Invite";
import QuestionList from "components/QuestionList";
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
  const { data: questions, mutate } = useSWR<QuestionInfo[]>(
    `/api/read/question?familyId=${family?.id}`,
    fetcher
  );

  console.log(family);
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

    if (savedQuestion) mutate();
  };

  return (
    !isLoading && (
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
          className="justify-content-center"
        >
          <h1>The {family?.name} Family</h1>{" "}
          {isViewerAdmin && (
            <h1
              style={{
                marginLeft: "1rem",
                marginTop: "0.5rem",
                color: "black",
                border: "1px solid black",
                width: "2rem",
                height: "2rem",
                lineHeight: "2rem",
                textAlign: "center",
                borderRadius: "50%",
              }}
            >
              {" "}
              i{" "}
            </h1>
          )}
        </div>
        {isViewerFamily ? (
          <div className="justify-content-center">
            <InviteForm />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
              className="justify-content-center"
            >
              <h1
                style={{
                  margin: "2rem",
                  color: !menuItem ? "blue" : "black",
                }}
                onClick={(e) => setMenuItem(false)}
              >
                Members
              </h1>
              <h1
                style={{
                  margin: "2rem",
                  color: menuItem ? "blue" : "black",
                }}
                onClick={(e) => setMenuItem(true)}
              >
                Questions
              </h1>
            </div>
            <div>
              {!menuItem ? (
                <FamilyList>
                  {family!.SantasOnFamilies.filter(
                    (s) => s.santa_id !== santa?.id
                  ).map((s, idx) => {
                    return (
                      <FamilyMember
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
                      </FamilyMember>
                    );
                  })}
                </FamilyList>
              ) : (
                <div>
                  <QuestionList questions={questions!} />
                  {isViewerAdmin && <AddQuestion addQHandler={handleQAdd} />}
                </div>
              )}
            </div>
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
