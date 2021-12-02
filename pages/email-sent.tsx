export default function LoginEmailSent(): JSX.Element {
  return (
    <div className="container px-6 py-16 mx-auto flex flex-row justify-center">
      <div className="lg:max-w-lg">
        <h1 className="text-4xl font-semibold text-gray-800 dark:text-white lg:text-6xl">
          Please check your email to{" "}
          <span className="text-[#EA4630]">Login</span>
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg lg:text-2xl">
          you should receive an email with a{" "}
          <span className="font-medium text-[#EA4630]">magic link </span>
          to login to your account
        </p>
      </div>
    </div>
  );
}
