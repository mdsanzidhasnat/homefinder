"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PropertyCard } from "./property-card";
import { PropertyCardSkeleton } from "./property-card-skeleton";
import { createClient } from "@/lib/supabase/client";
import type { Property } from "@/types";
import {
  Search,
  SearchCheck,
  Home,
  Handshake,
  Building2,
  ArrowRight,
} from "lucide-react";

const POPULAR_AREAS = [
  {
    name_bn: "গুলশান",
    name_en: "Gulshan",
    image: "/images/gulshan.jpg",
    count: 45,
    slug: "gulshan",
  },
  {
    name_bn: "ধানমন্ডি",
    name_en: "Dhanmondi",
    image: "/images/dhanmondi.jpg",
    count: 38,
    slug: "dhanmondi",
  },
  {
    name_bn: "উত্তরা",
    name_en: "Uttara",
    image: "/images/uttara.jpg",
    count: 52,
    slug: "uttara",
  },
  {
    name_bn: "বসুন্ধরা",
    name_en: "Bashundhara",
    image: "/images/bashundhara.jpg",
    count: 31,
    slug: "bashundhara",
  },
  {
    name_bn: "মিরপুর",
    name_en: "Mirpur",
    image: "/images/mirpur.jpg",
    count: 27,
    slug: "mirpur",
  },
  {
    name_bn: "আগ্রাবাদ",
    name_en: "Agrabad",
    image: "/images/agrabad.jpg",
    count: 22,
    slug: "agrabad",
  },
];

export function HomePage() {
  const locale = useLocale();
  const t = useTranslations("home");
  const ct = useTranslations("common");
  const [featured, setFeatured] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("listings")
          .select("*")
          .eq("status", "available")
          .order("posted_date", { ascending: false })
          .limit(6);
        if (data) setFeatured(data as unknown as Property[]);
      } catch {
        console.error("Failed to fetch featured listings");
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    window.location.href = `/${locale}/search?${params.toString()}`;
  };

  return (
    <div>
      <section className="hero-gradient text-white">
        <div className="container-page py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {t("hero_title")}
            </h1>
            <p className="text-lg md:text-xl text-white/80">
              {t("hero_subtitle")}
            </p>
            <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t("hero_search_placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-white text-foreground border-0"
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-6">
                <SearchCheck className="h-5 w-5 mr-2" />
                {ct("search")}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">
              {t("featured_title")}
            </h2>
            <p className="text-muted-foreground mt-1">
              {t("featured_subtitle")}
            </p>
          </div>
          <Link href={`/${locale}/search`}>
            <Button variant="outline" className="gap-2">
              {ct("view_all")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <PropertyCardSkeleton key={i} />
              ))
            : featured.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
        </div>
      </section>

      <section className="bg-muted/30 py-16">
        <div className="container-page">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">
              {t("popular_areas_title")}
            </h2>
            <p className="text-muted-foreground mt-1">
              {t("popular_areas_subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {POPULAR_AREAS.map((area) => (
              <Link
                key={area.slug}
                href={`/${locale}/search?area=${area.slug}`}
                className="group relative rounded-xl overflow-hidden aspect-square"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10 z-10" />
                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                  <Building2 className="h-12 w-12 text-muted-foreground/50" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white">
                  <h3 className="font-semibold">
                    {locale === "bn" ? area.name_bn : area.name_en}
                  </h3>
                  <p className="text-sm text-white/80">
                    {area.count} {locale === "bn" ? "টি প্রপার্টি" : "properties"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold">
            {t("how_it_works_title")}
          </h2>
          <p className="text-muted-foreground mt-1">
            {t("how_it_works_subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { icon: Search, title: t("step1_title"), desc: t("step1_desc") },
            { icon: Home, title: t("step2_title"), desc: t("step2_desc") },
            {
              icon: Handshake,
              title: t("step3_title"),
              desc: t("step3_desc"),
            },
          ].map((step, i) => (
            <div key={i} className="text-center space-y-3">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <step.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="hero-gradient text-white py-16">
        <div className="container-page text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold">{t("cta_title")}</h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            {t("cta_subtitle")}
          </p>
          <Link href={`/${locale}/auth/register`}>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6"
            >
              {t("cta_button")}
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
