import { UserGroupIcon } from "@heroicons/react/solid";
import Link from "next/link";

export const FamilyList = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return (
    <div className="w-full flex flex-col">
      <h1 className="text-4xl text-[#308344] font-bold mb-1 mx-auto">
        Your Families
      </h1>
      <hr className="my-2 opacity-50" />
      {children}
    </div>
  );
};

export const FamilyListCard = ({
  santaId,
  family,
  familySelection,
}: {
  santaId: string;
  family: {
    id: string;
    name: string;
  };
  familySelection: (id: string, name: string) => void;
}) => {
  return (
    <div className={`bg-white my-1 w-full shadow-md rounded-lg`}>
      <div className="flex flex-row px-1 py-2 sm:px-6 justify-around sm:justify-between max-h-14">
        <h3 className="text-2xl sm:text-3xl leading-6 my-auto ml-2 sm:ml-0 font-medium text-[#297439] w-3/5 lg:w-2/3">{`${family.name}`}</h3>
        <div className="w-2/5 lg:w-1/3 flex flex-row justify-end">
          <div
            onClick={() => familySelection(family.id, family.name)}
            className="flex flex-col bg-[#308344] hover:bg-[#297439] rounded-full w-10 h-10 shadow-lg hover:scale-105 
            ml-4 transition-transform duration-300 ease-in-out cursor-pointer"
          >
            <p className="w-full h-full rounded-full text-center text-white text-4xl -mt-0.25">
              ?
            </p>
          </div>
          <Link passHref href={`/f/${family.id}`}>
            <div
              className="flex flex-col bg-[#308344] hover:bg-[#297439] rounded-full w-10 h-10 ml-4 mr-1 shadow-lg hover:scale-105 
            transition-transform duration-300 ease-in-out cursor-pointer"
            >
              <UserGroupIcon
                className={`w-8 h-8 mx-auto my-auto pb-1 text-white`}
              />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
