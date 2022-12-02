export const FamilyRulesCard = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <section className="mt-4 w-full flex justify-center">
      <div className="w-3/4 lg:w-1/2 bg-white m-2 shadow overflow-scroll rounded-md sm:rounded-lg px-6 py-8 mx-auto">
        <div className="flex justify-center">
          <div className="lg:w-1/2 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
              Santa Rules:
            </h2>

            <p className="mt-4 text-gray-500 dark:text-gray-400 lg:max-w-md">
              {children}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
