"use client";

import { useState } from "react";
import { usePathname } from "@/lib/navigation";
import { Link } from "@/lib/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./language-switcher";
import { useAuthStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import {
  Menu,
  X,
  Home,
  User,
  LogOut,
  PlusCircle,
  LayoutDashboard,
} from "lucide-react";

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    clearUser();
  };

  const isAgent = user?.role === "agent";

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/search?purpose=sale", label: t("buy") },
    { href: "/search?purpose=rent", label: t("rent") },
    { href: "/agents", label: t("agents") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-page flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-primary"
          >
            <Home className="h-6 w-6" />
            <span className="hidden sm:inline">
              {locale === "bn" ? "বিডি হোম ফাইন্ডার" : "BD Home Finder"}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-accent/10 ${
                  pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          {user ? (
            <div className="hidden md:flex items-center gap-2">
              {isAgent && (
                <Link href="/dashboard/listings/new">
                  <Button variant="default" size="sm" className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    {t("post_property")}
                  </Button>
                </Link>
              )}
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  {t("dashboard")}
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                {t("logout")}
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  {t("login")}
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="default" size="sm">
                  {t("register")}
                </Button>
              </Link>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-background p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-accent/10 ${
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t space-y-2">
            {user ? (
              <>
                {isAgent && (
                  <Link
                    href="/dashboard/listings/new"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Button variant="default" size="sm" className="w-full gap-2">
                      <PlusCircle className="h-4 w-4" />
                      {t("post_property")}
                    </Button>
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    {t("dashboard")}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full gap-2 justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  {t("logout")}
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    {t("login")}
                  </Button>
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileOpen(false)}
                >
                  <Button variant="default" size="sm" className="w-full">
                    {t("register")}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
