"use client";

import { usePathname, useRouter } from "@/lib/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("common");
  const pathname = usePathname();
  const router = useRouter();

  const toggleLocale = () => {
    const newLocale = locale === "bn" ? "en" : "bn";
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLocale}
      className="gap-2"
      aria-label={t("language")}
    >
      <Globe className="h-4 w-4" />
      <span className="hidden sm:inline">
        {locale === "bn" ? "English" : "বাংলা"}
      </span>
    </Button>
  );
}
