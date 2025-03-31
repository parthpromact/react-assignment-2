// app/layout.tsx
import React, { useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
const Navbar = dynamic(() => import("@/components/common/Navbar"), {ssr: false});

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  // Exclude Auth Routes
  const isAuthPage = router.pathname === "/login" || router.pathname === "/register";
 
  return (
    <div className="flex flex-col h-screen">
      {!isAuthPage && (
        <Navbar />
      )}
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
};

export default Layout;
