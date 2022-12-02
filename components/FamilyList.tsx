import { ExternalLinkIcon } from "@heroicons/react/outline";
import Link from "next/link";

export const FamilyList = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return (
    <div className="w-full flex flex-col">
      <h1 className="text-4xl font-bold mb-2 ml-4">Families</h1>
      {children}
    </div>
  );
};

export const FamilyListCard = ({
  santaId,
  family,
  handleClick,
}: {
  santaId: string;
  family: {
    id: string;
    name: string;
  };
  handleClick: (id: string, name: string) => void;
}) => {
  return (
    <div className="bg-white m-2 w-[95%] xs:w-2/3 h-16 shadow rounded-lg">
      <div className="h-full w-full flex flex-row overflow-hidden">
        <h3
          onClick={() => handleClick(family.id, family.name)}
          className="flex flex-col justify-center pl-4 text-lg h-full w-2/3 leading-6 font-medium text-gray-900 bg-gray-200 cursor-pointer hover:bg-gray-100 rounded-l-lg"
        >
          {family.name}
        </h3>
        <Link passHref href={`/f/${family.id}`}>
          <div className="flex flex-col m-auto  cursor-pointer">
            <ExternalLinkIcon className="w-8 h-8 text-[#165B33] hover:text-[#7C9F61] rounded-md" />
          </div>
        </Link>
      </div>
    </div>
  );
};
