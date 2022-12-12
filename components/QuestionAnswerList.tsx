import { PencilIcon } from "@heroicons/react/outline";
import React, { useState } from "react";

type QuestionAnswerListCardProps = {
  familyName: string;
  isShowing: boolean;
  closeCard: () => void;
  children: React.ReactNode;
};

export const EmptyQuestionAnswerListCard = ({}) => {
  return (
    <section className="mt-4 w-full flex justify-center">
      <div className="bg-white m-2 shadow overflow-scroll rounded-lg px-6 py-8">
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

export const QuestionAnswerListCard = ({
  familyName,
  isShowing,
  closeCard,
  children,
}: QuestionAnswerListCardProps): JSX.Element => {
  return (
    <section
      className={`fixed top-0 left-0 right-0 bottom-0 ${
        isShowing ? "flex" : "hidden"
      }  w-full h-screen justify-center mx-auto bg-opacity-30 bg-gray-600`}
    >
      <div className="bg-white w-11/12 sm:w-4/5 md:1/2 lg:w-1/2 xl:w-2/5 2xl:w-1/3 m-4 shadow rounded-lg px-6 py-2 sm:py-8">
        <div
          onClick={() => closeCard()}
          className="w-full relative h-2 flex flex-row justify-end overflow-visible"
        >
          <div
            className="absolute -right-5 -top-1 sm:-top-7 bg-[#308344] hover:bg-[#297439] rounded-full w-10 h-10 shadow-lg hover:scale-105 
            ml-4 transition-transform duration-300 ease-in-out cursor-pointer"
          >
            <p className="w-full h-full rounded-full text-center text-white text-2xl mt-1">
              X
            </p>
          </div>
        </div>
        <div className="flex flex-row mb-3 h-auto">
          <h3 className="w-11/12 text-lg sm:text-2xl leading-6 font-medium text-[#297439]">
            {familyName} Family Questions
          </h3>
        </div>
        <div className="border-t border-gray-200 overflow-scroll">
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
      <dt className="flex flex-col justify-center text-sm font-medium text-[#297439]">
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
              transform bg-[#308344] rounded-md hover:bg-[#297439] focus:outline-none focus:ring focus:ring-[#7C9F61] focus:ring-opacity-80`}
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
              className="w-6 h-6 cursor-pointer text-[#308344] rounded-md hover:text-[#297439]"
            />
          </>
        )}
      </dd>
    </div>
  );
};
