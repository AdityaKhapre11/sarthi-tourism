"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Header, Footer } from "@/components/layout";
import { SearchModal } from "@/components/ui";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleOpenSearch = () => setIsSearchOpen(true);
    window.addEventListener("openSearchModal", handleOpenSearch);
    return () => window.removeEventListener("openSearchModal", handleOpenSearch);
  }, []);

  return (
    <>
      {!isAdmin && <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />}
      {!isAdmin && <Header onOpenSearch={() => setIsSearchOpen(true)} />}
      <main className="flex-1">{children}</main>
      {!isAdmin && <Footer />}
    </>
  );
}
