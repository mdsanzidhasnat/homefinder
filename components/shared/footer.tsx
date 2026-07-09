"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { Home } from "lucide-react";

export function Footer() {
  const t = useTranslations("common");
  const locale = useLocale();

  const footerLinks = {
    [t("home")]: [
      { href: `/${locale}`, label: t("home") },
      { href: `/${locale}/search?purpose=sale`, label: "Buy" },
      { href: `/${locale}/search?purpose=rent`, label: "Rent" },
      { href: `/${locale}/agents`, label: t("agents") },
    ],
    "Company": [
      { href: `/${locale}/about`, label: t("about") },
      { href: `/${locale}/contact`, label: t("contact_us") },
    ],
    "Support": [
      { href: `/${locale}/contact`, label: t("contact_us") },
      { href: "#", label: t("terms") },
      { href: "#", label: t("privacy") },
    ],
  };

  return (
    <footer className="border-t bg-muted/30">
      <div className="container-page py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link
              href={`/${locale}`}
              className="flex items-center gap-2 text-lg font-bold text-primary mb-4"
            >
              <Home className="h-5 w-5" />
              {locale === "bn" ? "বিডি হোম ফাইন্ডার" : "BD Home Finder"}
            </Link>
            <p className="text-sm text-muted-foreground">{t("tagline")}</p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-sm mb-3">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          {t("copyright")}
        </div>
      </div>
    </footer>
  );
}
