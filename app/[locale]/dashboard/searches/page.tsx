"use client";

import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

export default function SavedSearchesPage() {
  const locale = useLocale();
  const t = useTranslations("dashboard.buyer");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("saved_searches")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 space-y-4">
          <Search className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">{t("no_searches")}</p>
        </div>
      </CardContent>
    </Card>
  );
}
