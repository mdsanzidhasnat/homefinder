"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  const t = useTranslations("common");
  const locale = useLocale();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <div className="text-8xl font-bold text-primary">404</div>
      <h1 className="text-2xl font-bold text-center">{t("not_found")}</h1>
      <p className="text-muted-foreground text-center max-w-md">
        {t("not_found_desc")}
      </p>
      <Link href={`/${locale}`}>
        <Button className="gap-2">
          <Home className="h-4 w-4" />
          {t("go_home")}
        </Button>
      </Link>
    </div>
  );
}
