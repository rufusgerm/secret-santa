import { QuestionInfo } from "@lib/types";

const QuestionList = ({
  questions,
}: {
  questions: QuestionInfo[];
}): JSX.Element => {
  return (
    <ol>
      {questions?.map((q) => (
        <Question key={`${q.id}-${q.text}`} question={q} />
      ))}
    </ol>
  );
};

const Question = ({ question }: { question: QuestionInfo }): JSX.Element => {
  return <li>{question.text}</li>;
};

export default QuestionList;
