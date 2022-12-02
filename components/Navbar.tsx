import { Disclosure, Menu } from "@headlessui/react";
import {
  HomeIcon,
  LogoutIcon,
  MenuIcon,
  XIcon,
} from "@heroicons/react/outline";
import useSanta from "@lib/hooks/useSanta";
import Link from "next/link";
import React from "react";

export default function Navbar() {
  const { santa, mutateSanta } = useSanta();

  const navigation = santa?.isLoggedIn ? [
    { name: "Home", href: `/s/${santa?.id}` },
    { name: "Logout", href: "/logout" },
  ] : [
    { name: "Home", href: `/` },
    { name: "Login", href: "/login" },
  ];

  const logout = async (e: { preventDefault: Function }) => {
    e.preventDefault();

    const response = await fetch("/api/logout", { method: "POST" });

    if (response.ok) mutateSanta();
  };

  return (
    <Disclosure as="nav" className="bg-[#165B33]">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button
                  className={`inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-[#7C9F61] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white`}
                >
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <Link passHref href="/">
                  <h1 className="text-white text-4xl hover:cursor-pointer hover:text-[#7C9F61]">
                    Simple Santa
                  </h1>
                </Link>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <Menu as="div" className="ml-3 relative">
                  <div className="flex flex-row justify-center">
                    {santa?.isLoggedIn ? (
                      <>
                        <Menu.Item
                          as="circle"
                          className="bg-[#165B33] text-center hidden sm:block mx-2 text-sm rounded-full focus:outline-none"
                        >
                          <span className="sr-only">Open user menu</span>
                          <p className="h-8 w-8 rounded-full text-white bg-[#7C9F61] pt-[0.33rem]">
                            {`${santa?.first_name[0]}${santa?.last_name[0]}`}
                          </p>
                        </Menu.Item>
                        <Link href={`/s/${santa.id}`} passHref>
                          <Menu.Item
                            as="a"
                            className="mx-2 hidden sm:block my-auto"
                          >
                            <HomeIcon
                              className="h-5 w-5 text-[#7C9F61] hover:text-[#91ac7c]"
                              aria-hidden="true"
                            />
                          </Menu.Item>
                        </Link>
                        <Menu.Item
                          as="a"
                          onClick={(e) => logout(e)}
                          className="mx-2 hidden sm:block my-auto cursor-pointer"
                        >
                          <LogoutIcon
                            className="h-5 w-5 text-[#7C9F61] hover:text-[#91ac7c]"
                            aria-hidden="true"
                          />
                        </Menu.Item>
                      </>
                    ) : (
                      <Link passHref href="/login">
                        <button
                          type="submit"
                          className="group relative w-full hidden xs:flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#7C9F61] hover:bg-[#91ac7c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7C9F61]"
                        >
                          <span className="absolute left-0 inset-y-0 flex items-center pl-3"></span>
                          Login
                        </button>
                      </Link>
                    )}
                  </div>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={`text-gray-300 hover:bg-[#7C9F61] hover:text-white block px-3 py-2 rounded-md text-base font-medium`}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
