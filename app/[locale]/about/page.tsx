"use client";

import { useLocale, useTranslations } from "next-intl";
import { Building2, Users, ShieldCheck, TrendingUp } from "lucide-react";

export default function AboutPage() {
  const locale = useLocale();
  const t = useTranslations("about");

  const stats = [
    { icon: Building2, value: "500+", label: t("stat1") },
    { icon: Users, value: "10,000+", label: t("stat2") },
    { icon: ShieldCheck, value: "200+", label: t("stat3") },
    { icon: TrendingUp, value: "8", label: t("stat4") },
  ];

  return (
    <div className="container-page py-16 space-y-16">
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-bold">{t("title")}</h1>
        <p className="text-xl text-muted-foreground">{t("subtitle")}</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-3 p-6 rounded-xl border bg-card">
          <h2 className="text-xl font-bold">{t("mission_title")}</h2>
          <p className="text-muted-foreground">{t("mission_desc")}</p>
        </div>
        <div className="space-y-3 p-6 rounded-xl border bg-card">
          <h2 className="text-xl font-bold">{t("vision_title")}</h2>
          <p className="text-muted-foreground">{t("vision_desc")}</p>
        </div>
        <div className="space-y-3 p-6 rounded-xl border bg-card">
          <h2 className="text-xl font-bold">{t("values_title")}</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <strong className="text-foreground">
                {t("value1_title")}:
              </strong>{" "}
              {t("value1_desc")}
            </li>
            <li>
              <strong className="text-foreground">
                {t("value2_title")}:
              </strong>{" "}
              {t("value2_desc")}
            </li>
            <li>
              <strong className="text-foreground">
                {t("value3_title")}:
              </strong>{" "}
              {t("value3_desc")}
            </li>
          </ul>
        </div>
      </section>

      <section className="text-center space-y-8">
        <h2 className="text-2xl font-bold">{t("stats_title")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-2">
              <stat.icon className="h-8 w-8 mx-auto text-primary" />
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
