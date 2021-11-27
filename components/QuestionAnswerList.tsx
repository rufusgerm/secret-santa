import { PencilIcon } from "@heroicons/react/outline";
import React, { useState } from "react";

type QuestionAnswerListCardProps = {
  familyName: string;
  children: React.ReactNode;
};

export const QuestionAnswerListCard = ({
  familyName,
  children,
}: QuestionAnswerListCardProps): JSX.Element => {
  return (
    <section className="mt-4 w-full flex justify-center">
      <div className="bg-white mt-4 shadow h-96 overflow-scroll m-2 sm:rounded-lg px-6 py-8 mx-auto">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            The {familyName} Family
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>{children}</dl>
        </div>
      </div>
    </section>
  );
};

type QuestionAnswerListItemProps = {
  question: { id: number; text: string };
  answer: { id: number; text: string };
  rowColor: "bg-gray-50" | "bg-white";
  editAnswer: (id: number, newAnswer: string, questionId: number) => void;
};

export const QuestionAnswerListItem = ({
  question,
  answer,
  rowColor,
  editAnswer,
}: QuestionAnswerListItemProps): JSX.Element => {
  const [editingAnswer, setEditingAnswer] = useState<boolean>(false);
  const [newAnswer, setNewAnswer] = useState<string>("");

  const handleAnswerEditing = () => {
    if (newAnswer !== answer.text) {
      editAnswer(answer.id, newAnswer, question.id);
      answer.text = newAnswer;
    }
    //optimistically setting the value
    setEditingAnswer(false);
  };

  return (
    <div className={`${rowColor} sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
      <dt className="flex flex-col justify-center text-sm font-medium text-gray-500 ">
        <p>{question.text}</p>
      </dt>
      <dd
        style={{ minHeight: "3.5rem" }}
        className="mt-1 text-sm flex flex-row items-center justify-evenly h-auto text-gray-900 sm:mt-0 sm:col-span-2"
      >
        {editingAnswer ? (
          <>
            <textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              required
              aria-label="Answer"
              className="w-3/4 mx-2 rounded border-gray-400 focus:outline-none focus:ring focus:ring-[#7C9F61] focus:ring-opacity-80"
            />
            <button
              onClick={() => handleAnswerEditing()}
              className={`px-6 py-2.5 xl:mt-0 font-medium tracking-wide text-white capitalize transition-colors duration-200 
              transform bg-[#146B3A] rounded-md hover:bg-[#165B33] focus:outline-none focus:ring focus:ring-[#7C9F61] focus:ring-opacity-80`}
            >
              Save
            </button>
          </>
        ) : (
          <>
            <p className="w-5/6">{answer.text}</p>
            <PencilIcon
              onClick={() => {
                setEditingAnswer(true);
                setNewAnswer(answer.id > 0 ? answer.text : "");
              }}
              className="w-6 h-6 cursor-pointer text-[#146B3A] rounded-md hover:text-[#7C9F61]"
            />
          </>
        )}
      </dd>
    </div>
  );
};

export const EmptyQuestionAnswerListCard = ({}) => {
  return (
    <section className="mt-4 w-full flex justify-center">
      <div className="bg-white m-2 shadow overflow-scroll sm:rounded-lg px-6 py-8 mx-auto">
        <div className="flex justify-center">
          <div className="lg:w-1/2 h-96 flex flex-col justify-center">
            <h2 className="text-xl font-bold text-center text-gray-300 dark:text-gray-100">
              Choose one of your families to see the questions and your
              answers...
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
};
