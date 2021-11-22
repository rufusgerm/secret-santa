import useSanta from "@lib/hooks/useSanta";
import React from "react";
import NavBar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { santa, isLoading } = useSanta();
  return (
    <>
      {!isLoading && <NavBar />}
      <main>{children}</main>
    </>
  );
}
