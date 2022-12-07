import { ChevronRightIcon } from "@heroicons/react/outline";
import { ChevronDownIcon, EyeIcon } from "@heroicons/react/solid";

type FamilyMemberListProps = {
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

const FamilyMemberList = ({ children }: { children: any }): JSX.Element => {
  return (
    <div className="w-full flex flex-col xl:flex-row flex-wrap content-center mt-4 xl:justify-center">
      {children}
    </div>
  );
};

type FamilyMemberCardProps = {
  id: string;
  firstName: string;
  lastName: string;
  isViewerAdmin: boolean;
  setVisible: (id: string) => void;
  areAnswersVisible: boolean;
  children: React.ReactNode;
};

export const FamilyMemberCard = ({
  id,
  firstName,
  lastName,
  isViewerAdmin,
  setVisible,
  areAnswersVisible,
  children,
}: FamilyMemberCardProps): JSX.Element => {
  return (
    <div
      className={`bg-white m-2 w-3/4 lg:w-1/2 xl:w-1/3 shadow rounded-lg ${
        !areAnswersVisible ? "max-h-[3.25rem]" : ""
      }`}
    >
      <div className="flex flex-row px-1 py-2 sm:px-6 justify-around sm:justify-between max-h-14">
        <h3 className="text-lg sm:text-3xl leading-6 my-auto font-medium text-gray-900 w-2/3">{`${firstName} ${lastName}`}</h3>
        <ChevronDownIcon
          onClick={() => (areAnswersVisible ? setVisible("") : setVisible(id))}
          className={`w-8 h-8 pl-0.5 my-auto text-[#308344] hover:text-[#297439] cursor-pointer transition duration-200 ${
            areAnswersVisible ? "rotate-180" : ""
          }`}
        />
      </div>
      <div
        className={`border-t border-gray-200 overflow-scroll h-48 ${
          areAnswersVisible ? "visible" : "hidden"
        }`}
      >
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

export default FamilyMemberList;
