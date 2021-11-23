import Link from "next/link";
import { PaperClipIcon } from "@heroicons/react/solid";

type FamilyListProps = {
  familyMembers: SantaInFamily[];
  isViewerAdmin: boolean;
};

type SantaInFamily = {
  santa: {
    first_name: string;
    last_name: string;
  };
  santa_id: string;
  santa_is_admin: boolean;
};

const FamilyList = ({ children }: { children: any }): JSX.Element => {
  return (
    <div className="w-full flex flex-row flex-wrap justify-center">
      {children}
    </div>
  );
};

type FamilyMemberProps = {
  id: string;
  firstName: string;
  lastName: string;
  isViewerAdmin: boolean;
  children: React.ReactNode;
};

export const FamilyMember = ({
  id,
  firstName,
  lastName,
  isViewerAdmin,
  children,
}: FamilyMemberProps): JSX.Element => {
  return (
    <div className="bg-white m-2 w-1/3 shadow overflow-scroll sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{`${firstName} ${lastName}`}</h3>
      </div>
      <div className="border-t border-gray-200">
        <dl>{children}</dl>
      </div>
    </div>
  );
};

type FamilyMemberAnswersProps = {
  question: string;
  answer: string;
  rowColor: "bg-gray-50" | "bg-white";
};

export const FamilyMemberAnswers = ({
  question,
  answer,
  rowColor,
}: FamilyMemberAnswersProps): JSX.Element => {
  return (
    <div
      className={`${rowColor} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}
    >
      <dt className="text-sm font-medium text-gray-500">{question}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
        {answer}
      </dd>
    </div>
  );
};

export default FamilyList;

{
  /* <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
  <dt className="text-sm font-medium text-gray-500">Full name</dt>
  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
    Margot Foster
  </dd>
</div>
<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
  <dt className="text-sm font-medium text-gray-500">Application for</dt>
  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
    Backend Developer
  </dd>
</div>
<div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
  <dt className="text-sm font-medium text-gray-500">Email address</dt>
  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
    margotfoster@example.com
  </dd>
</div>
<div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
  <dt className="text-sm font-medium text-gray-500">Salary expectation</dt>
  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
    $120,000
  </dd>
</div>
<div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
  <dt className="text-sm font-medium text-gray-500">About</dt>
  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
    Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt
    cillum culpa consequat. Excepteur qui ipsum aliquip consequat sint. Sit id
    mollit nulla mollit nostrud in ea officia proident. Irure nostrud pariatur
    mollit ad adipisicing reprehenderit deserunt qui eu.
  </dd>
</div> */
}
