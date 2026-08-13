"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Menu, X, Search, User, LogOut } from "lucide-react";
import { useLenis } from "@/components/layout";
import { Button } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import { performLogout } from "@/lib/auth/logout";

import { User as SupabaseUser } from "@supabase/supabase-js";

interface HeaderProps {
  onOpenSearch?: () => void;
}

export function Header({ onOpenSearch }: HeaderProps = {}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const pathname = usePathname();
  const router = useRouter();
  const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const supabase = createClient();

  const handleLogoClick = (e: React.MouseEvent) => {
    setIsMobileMenuOpen(false);
    if (pathname === "/") {
      e.preventDefault();
      lenis?.scrollTo(0, { offset: 0 });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };
    
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      lenis?.stop();
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      lenis?.start();
    }
    
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      lenis?.start();
    };
  }, [isMobileMenuOpen, lenis]);

  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current && !dropdownRef.current.contains(target) &&
        mobileDropdownRef.current && !mobileDropdownRef.current.contains(target)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    await performLogout(router);
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return "U";
  };

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -50% 0px" }
    );

    const sections = ["home", "packages", "about", "contact"];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    if (window.scrollY < 100) setTimeout(() => setActiveSection("home"), 0);

    return () => observer.disconnect();
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed z-50 transition-all duration-500 ease-out left-1/2 -translate-x-1/2 ${hasScrolled
          ? "top-1 w-[95%] sm:w-[90%] max-w-8xl rounded-[32px] bg-background/80 backdrop-blur-xl shadow-2xl"
          : "top-0 w-full rounded-none bg-transparent py-6"
          }`}
      >
        <div className="container mx-auto flex items-center justify-between px-6 lg:px-10">
          <Link
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2 font-heading text-2xl font-bold z-50"
          >
            <Image
              src="/images/logo1.png"
              alt="Sarthi Tourism Logo"
              width={200}
              height={64}
              className="object-contain h-14 sm:h-20 w-auto transition-all"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            {["Home", "About Us", "Packages", "Contact Us"].map((item) => {
              const target = item === "Home" ? "/" : item === "Packages" ? "/packages" : item === "About Us" ? "/#about" : "/#contact";
              const hashId = target.startsWith("/#") ? target.substring(1) : "";

              let isActive = false;
              if (item === "Home") {
                isActive = pathname === "/" && (activeSection === "home" || activeSection === "");
              } else if (item === "Packages") {
                isActive = pathname.startsWith("/packages") || (pathname === "/" && activeSection === "packages");
              } else if (item === "About Us") {
                isActive = pathname === "/" && activeSection === "about";
              } else if (item === "Contact Us") {
                isActive = pathname === "/" && activeSection === "contact";
              }

              return (
                <Link
                  key={item}
                  href={target}
                  onClick={(e) => {
                    if (pathname === "/" && hashId) {
                      e.preventDefault();
                      lenis?.scrollTo(hashId, { offset: -80 });
                    } else if (pathname === "/" && item === "Home") {
                      e.preventDefault();
                      lenis?.scrollTo(0, { offset: 0 });
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  className={`group relative px-2 py-1 overflow-hidden font-medium flex items-center justify-center ${isActive ? "text-white" : "text-gray-300"}`}
                >
                  <div className={`flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${isActive ? "-translate-y-1/2" : "group-hover:-translate-y-1/2"} absolute top-0 left-0 w-full h-[200%]`}>
                    <span className="h-1/2 flex items-center justify-center text-gray-300">{item}</span>
                    <span className="h-1/2 flex items-center justify-center text-white">{item}</span>
                  </div>
                  {/* Invisible spacer to maintain width */}
                  <span className="opacity-0">{item}</span>
                  <div className={`absolute bottom-0 left-0 w-full h-[2px] bg-blue-500 transition-transform origin-left duration-300 ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}></div>
                </Link>
              );
            })}

            <Button
              variant="ghost"
              size="icon"
              onClick={onOpenSearch}
              aria-label="Search packages"
              className="text-gray-300 hover:text-white transition-colors cursor-hover p-2 rounded-full hover:bg-white/5"
            >
              <Search className="w-5 h-5" />
            </Button>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all overflow-hidden border border-white/20"
                >
                  {user.user_metadata?.avatar_url ? (
                    <Image src={user.user_metadata.avatar_url} alt="Profile" width={40} height={40} className="w-full h-full object-cover" />
                  ) : (
                    <span>{getInitials(user.user_metadata?.full_name, user.email)}</span>
                  )}
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-[260px] p-3 rounded-[24px] bg-[#11111a]/95 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 rounded-[20px] w-full">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold shrink-0 overflow-hidden border border-white/20">
                        {user.user_metadata?.avatar_url ? (
                          <Image src={user.user_metadata.avatar_url} alt="Profile" width={40} height={40} className="w-full h-full object-cover" />
                        ) : (
                          <span>{getInitials(user.user_metadata?.full_name, user.email)}</span>
                        )}
                      </div>
                      <div className="text-left overflow-hidden">
                        <p className="text-sm font-semibold text-white truncate">{user.user_metadata?.full_name || "User"}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="w-full rounded-[20px] bg-transparent border border-white/10 hover:bg-white/5 font-bold text-white tracking-widest transition-all text-xs h-[44px] flex items-center justify-center gap-2 cursor-pointer uppercase"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full rounded-[20px] bg-[#2a1114] border border-red-500/20 hover:bg-red-500/20 font-bold text-[#ff5c5c] tracking-widest transition-all text-xs h-[44px] flex items-center justify-center gap-2 cursor-pointer uppercase"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  router.push("/login");
                }}
                variant="default"
                className="cursor-pointer bg-blue-600 hover:bg-blue-500 rounded-full font-semibold"
              >
                <User className="w-3.5 h-3.5" />
                Login
              </Button>
            )}

            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-6 py-2.5 font-bold text-white transition-all uppercase tracking-wider text-[11px] flex items-center gap-2"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Enquire Now
            </a>
          </nav>

          <div className="flex items-center gap-3 sm:gap-4 lg:hidden">
            {!isMobileMenuOpen && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onOpenSearch}
                  aria-label="Search packages"
                  className="text-white z-50 hover:bg-white/10"
                >
                  <Search className="h-6 w-6" />
                </Button>
                
                {user && (
                  <div className="relative z-50" ref={mobileDropdownRef}>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all overflow-hidden border border-white/20"
                    >
                      {user.user_metadata?.avatar_url ? (
                        <Image src={user.user_metadata.avatar_url} alt="Profile" width={40} height={40} className="w-full h-full object-cover" />
                      ) : (
                        <span>{getInitials(user.user_metadata?.full_name, user.email)}</span>
                      )}
                    </button>

                    {/* Mobile Dropdown Menu */}
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-3 w-[260px] p-3 rounded-[24px] bg-[#11111a]/95 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 rounded-[20px] w-full">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold shrink-0 overflow-hidden border border-white/20">
                            {user.user_metadata?.avatar_url ? (
                              <Image src={user.user_metadata.avatar_url} alt="Profile" width={40} height={40} className="w-full h-full object-cover" />
                            ) : (
                              <span>{getInitials(user.user_metadata?.full_name, user.email)}</span>
                            )}
                          </div>
                          <div className="text-left overflow-hidden">
                            <p className="text-sm font-semibold text-white truncate">{user.user_metadata?.full_name || "User"}</p>
                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                          </div>
                        </div>
                        <Link
                          href="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="w-full rounded-[20px] bg-transparent border border-white/10 hover:bg-white/5 font-bold text-white tracking-widest transition-all text-xs h-[44px] flex items-center justify-center gap-2 cursor-pointer uppercase"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full rounded-[20px] bg-[#2a1114] border border-red-500/20 hover:bg-red-500/20 font-bold text-[#ff5c5c] tracking-widest transition-all text-xs h-[44px] flex items-center justify-center gap-2 cursor-pointer uppercase"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="text-white z-50 hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-7 w-7" />
              ) : (
                <Menu className="h-7 w-7" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Premium Full-Screen Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-transparent/95 backdrop-blur-2xl transition-all duration-500 lg:hidden flex flex-col justify-center items-center ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >
        <div className="flex flex-col gap-6 sm:gap-8 text-center w-full px-6">
          {["Home", "Packages", "About Us", "Contact Us"].map((item, index) => {
            const target = item === "Home" ? "/" : item === "Packages" ? "/packages" : item === "About Us" ? "/#about" : "/#contact";
            const hashId = target.startsWith("/#") ? target.substring(1) : "";
            return (
              <Link
                key={item}
                href={target}
                className="text-3xl sm:text-4xl font-heading font-bold text-gray-400 hover:text-white transition-colors py-1"
                style={{
                  transform: isMobileMenuOpen ? "translateY(0)" : "translateY(20px)",
                  opacity: isMobileMenuOpen ? 1 : 0,
                  transition: `all 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1 + 0.1}s`,
                }}
                onClick={(e) => {
                  if (pathname === "/" && hashId) {
                    e.preventDefault();
                    lenis?.scrollTo(hashId, { offset: -80 });
                  } else if (pathname === "/" && item === "Home") {
                    e.preventDefault();
                    lenis?.scrollTo(0, { offset: 0 });
                  }
                  setIsMobileMenuOpen(false);
                }}
              >
                {item}
              </Link>
            );
          })}

          {user ? (
            <div className="hidden">
              {/* User profile is now handled in the top navbar */}
            </div>
          ) : (
            <Button
              onClick={() => {
                setIsMobileMenuOpen(false);
                router.push("/login");
              }}
              className="mt-4 mx-auto w-full max-w-[250px] rounded-full bg-white/5 border border-white/10 hover:bg-white/10 font-bold text-white uppercase tracking-widest transition-all text-sm h-[52px] flex items-center justify-center gap-2 cursor-pointer"
              style={{
                transform: isMobileMenuOpen ? "translateY(0)" : "translateY(20px)",
                opacity: isMobileMenuOpen ? 1 : 0,
                transition: `all 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.5s`,
              }}
            >
              <User className="w-4 h-4" />
              Login
            </Button>
          )}

          <a
            href={`https://wa.me/${WA_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 mx-auto w-full max-w-[250px] rounded-full bg-blue-600 hover:bg-blue-500 px-10 py-4 text-center font-bold text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] uppercase tracking-widest transition-all text-sm"
            style={{
              transform: isMobileMenuOpen ? "translateY(0)" : "translateY(20px)",
              opacity: isMobileMenuOpen ? 1 : 0,
              transition: `all 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.6s`,
            }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Enquire Now
          </a>
        </div>
      </div>
    </>
  );
}