"use client";

import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";

import Header from "./Header";
import Footer from "./Footer";

import AccountHeader from "./AccountHeader";
import AccountFooter from "./AccountFooter";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");
  const isAccount = pathname.startsWith("/account");
  const isAuth = pathname === "/login" || pathname === "/register";

  const isVillaOrCar =
    pathname.startsWith("/villas") || pathname.startsWith("/cars");

  // Admin layout
  if (isAdmin) {
    return <SessionProvider>{children}</SessionProvider>;
  }

  // Account + Login/Register layout
  if (isAccount || isAuth) {
    return (
      <SessionProvider>
        <AccountHeader />
        <main className="min-h-screen">{children}</main>
        <AccountFooter />
      </SessionProvider>
    );
  }

  // Villas + Cars layout
  if (isVillaOrCar) {
    return (
      <SessionProvider>
        <AccountHeader />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </SessionProvider>
    );
  }

  // Default website layout
  return (
    <SessionProvider>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </SessionProvider>
  );
}