"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Header, Footer } from "@/components/layout";
import { SearchModal } from "@/components/ui";

export function PublicLayout({ 
  children,
  featuredPackages = [] 
}: { 
  children: React.ReactNode,
  featuredPackages?: {name: string, link: string}[]
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isPolicyPage = pathname === "/privacy-policy" || pathname === "/terms-of-service";
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password" || pathname === "/reset-password";
  const hideHeaderFooter = isAdmin || isPolicyPage || isAuthPage;
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleOpenSearch = () => setIsSearchOpen(true);
    window.addEventListener("openSearchModal", handleOpenSearch);
    return () => window.removeEventListener("openSearchModal", handleOpenSearch);
  }, []);

  return (
    <>
      {!hideHeaderFooter && <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />}
      {!hideHeaderFooter && <Header onOpenSearch={() => setIsSearchOpen(true)} />}
      <main className="flex-1">{children}</main>
      {!hideHeaderFooter && <Footer featuredPackages={featuredPackages} />}
    </>
  );
}
