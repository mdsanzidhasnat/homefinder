"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { useAuthStore } from "@/lib/store";
import { usePathname } from "@/lib/navigation";
import {
  LayoutDashboard,
  Heart,
  Building2,
  PlusCircle,
  MessageSquare,
  Search,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";
import { useState, useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useLocale();
  const t = useTranslations("dashboard.sidebar");
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clearUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAgent = user?.role === "agent";

  const buyerLinks = [
    { href: `/${locale}/dashboard`, label: t("overview"), icon: LayoutDashboard },
    { href: `/${locale}/dashboard/favorites`, label: t("favorites"), icon: Heart },
    { href: `/${locale}/dashboard/searches`, label: t("searches"), icon: Search },
    { href: `/${locale}/dashboard/settings`, label: t("settings"), icon: Settings },
  ];

  const agentLinks = [
    { href: `/${locale}/dashboard`, label: t("overview"), icon: LayoutDashboard },
    { href: `/${locale}/dashboard/listings`, label: t("listings"), icon: Building2 },
    { href: `/${locale}/dashboard/listings/new`, label: t("create"), icon: PlusCircle },
    { href: `/${locale}/dashboard/inquiries`, label: t("inquiries"), icon: MessageSquare },
    { href: `/${locale}/dashboard/settings`, label: t("settings"), icon: Settings },
  ];

  const links = isAgent ? agentLinks : buyerLinks;

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    clearUser();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      <aside
        className={cn(
          "w-64 border-r bg-muted/10 shrink-0",
          "fixed inset-y-16 left-0 z-40 transform transition-transform lg:relative lg:inset-auto lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent/10 text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
          <div className="pt-4 mt-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive transition-colors w-full"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 min-w-0">
        <div className="lg:hidden border-b px-4 py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
