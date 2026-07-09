"use client";

import { useEffect, useState, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PropertyCard } from "@/components/shared/property-card";
import { PropertyCardSkeleton } from "@/components/shared/property-card-skeleton";
import { createClient } from "@/lib/supabase/client";
import type { Property, SearchFilters } from "@/types";
import { BD_LOCATIONS } from "@/lib/utils/bd-locations";
import {
  Search,
  SlidersHorizontal,
  List,
  Map as MapIcon,
  X,
  ChevronDown,
} from "lucide-react";

const PROPERTY_TYPES = [
  "apartment",
  "house",
  "land",
  "commercial",
  "office",
  "shop",
  "warehouse",
] as const;

const AMENITIES_OPTIONS = [
  "Gas line",
  "Lift",
  "Generator",
  "Parking",
  "Security",
  "Community facilities",
];

const SORT_OPTIONS = [
  { value: "newest", label: "search.newest" },
  { value: "price_asc", label: "search.price_low" },
  { value: "price_desc", label: "search.price_high" },
];

export function SearchPage() {
  const locale = useLocale();
  const t = useTranslations();
  const searchParams = useSearchParams();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [showFilters, setShowFilters] = useState(false);
  const limit = 12;

  const [filters, setFilters] = useState<SearchFilters>({
    purpose: (searchParams.get("purpose") as "sale" | "rent") || undefined,
    type: undefined,
    priceMin: undefined,
    priceMax: undefined,
    bedrooms: undefined,
    division: searchParams.get("division") || undefined,
    district: searchParams.get("district") || undefined,
    area: searchParams.get("area") || undefined,
    amenities: [],
    sort: "newest",
  });

  const totalPages = Math.ceil(totalCount / limit);
  const divisions = BD_LOCATIONS;
  const districts = divisions.find((d) => d.value === filters.division)?.districts || [];
  const areas = districts.find((d) => d.value === filters.district)?.areas || [];

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      let query = supabase.from("listings").select("*", { count: "exact" });

      if (filters.purpose) query = query.eq("purpose", filters.purpose);
      if (filters.type) query = query.eq("type", filters.type);
      if (filters.priceMin) query = query.gte("price", filters.priceMin);
      if (filters.priceMax) query = query.lte("price", filters.priceMax);
      if (filters.bedrooms) query = query.gte("bedrooms", filters.bedrooms);
      if (filters.division) query = query.eq("division", filters.division);
      if (filters.district) query = query.eq("district", filters.district);
      if (filters.area) query = query.eq("area_name", filters.area);
      if (filters.amenities?.length) {
        query = query.contains("amenities", filters.amenities);
      }

      switch (filters.sort) {
        case "price_asc":
          query = query.order("price", { ascending: true });
          break;
        case "price_desc":
          query = query.order("price", { ascending: false });
          break;
        default:
          query = query.order("posted_date", { ascending: false });
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, count } = await query;
      if (data) setProperties(data as unknown as Property[]);
      if (count !== null) setTotalCount(count);
    } catch {
      console.error("Search error");
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const clearFilters = () => {
    setFilters({
      purpose: undefined,
      type: undefined,
      priceMin: undefined,
      priceMax: undefined,
      bedrooms: undefined,
      division: undefined,
      district: undefined,
      area: undefined,
      amenities: [],
      sort: "newest",
    });
    setPage(1);
  };

  const hasFilters =
    filters.purpose ||
    filters.type ||
    filters.priceMin ||
    filters.priceMax ||
    filters.bedrooms ||
    filters.division ||
    filters.amenities?.length;

  return (
    <div className="container-page py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t("search.title")}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {totalCount} {t("search.results")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {t("search.filters")}
          </Button>
          <div className="hidden sm:flex border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-none"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "map" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("map")}
              className="rounded-none"
            >
              <MapIcon className="h-4 w-4" />
            </Button>
          </div>
          <Select
            value={filters.sort || "newest"}
            onValueChange={(value) =>
              setFilters({
                ...filters,
                sort: value as SearchFilters["sort"],
              })
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {t(opt.label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-6">
        <aside
          className={`w-64 shrink-0 space-y-6 ${
            showFilters ? "block" : "hidden"
          } md:block`}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{t("search.filters")}</h2>
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-auto p-0 text-xs text-primary"
              >
                <X className="h-3 w-3 mr-1" />
                {t("search.clear_filters")}
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label>{t("search.all_purposes")}</Label>
            <div className="flex gap-2">
              <Button
                variant={!filters.purpose ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  setFilters({ ...filters, purpose: undefined })
                }
                className="flex-1"
              >
                {t("search.any")}
              </Button>
              <Button
                variant={filters.purpose === "sale" ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  setFilters({ ...filters, purpose: "sale" })
                }
                className="flex-1"
              >
                {t("search.buy")}
              </Button>
              <Button
                variant={filters.purpose === "rent" ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  setFilters({ ...filters, purpose: "rent" })
                }
                className="flex-1"
              >
                {t("search.rent")}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("search.all_types")}</Label>
            <Select
              value={filters.type || "all"}
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  type: value === "all" ? undefined : (value as any),
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("search.all_types")}</SelectItem>
                {PROPERTY_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {t(`search.${type}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("search.price_range")}</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder={t("search.min_price")}
                value={filters.priceMin || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    priceMin: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
              />
              <Input
                type="number"
                placeholder={t("search.max_price")}
                value={filters.priceMax || ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    priceMax: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("search.bedrooms")}</Label>
            <Select
              value={filters.bedrooms?.toString() || "any"}
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  bedrooms: value === "any" ? undefined : Number(value),
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">{t("search.any")}</SelectItem>
                {[1, 2, 3, 4, 5].map((n) => (
                  <SelectItem key={n} value={n.toString()}>
                    {n}+
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("search.location")}</Label>
            <Select
              value={filters.division || ""}
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  division: value || undefined,
                  district: undefined,
                  area: undefined,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("search.division")} />
              </SelectTrigger>
              <SelectContent>
                {divisions.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {locale === "bn" ? d.label_bn : d.label_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {filters.division && (
              <Select
                value={filters.district || ""}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    district: value || undefined,
                    area: undefined,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("search.district")} />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {locale === "bn" ? d.label_bn : d.label_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {filters.district && (
              <Select
                value={filters.area || ""}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    area: value || undefined,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("search.area")} />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((a) => (
                    <SelectItem key={a.value} value={a.value}>
                      {locale === "bn" ? a.label_bn : a.label_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label>{t("search.amenities")}</Label>
            <div className="space-y-2">
              {AMENITIES_OPTIONS.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2">
                  <Checkbox
                    id={amenity}
                    checked={filters.amenities?.includes(amenity)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFilters({
                          ...filters,
                          amenities: [
                            ...(filters.amenities || []),
                            amenity,
                          ],
                        });
                      } else {
                        setFilters({
                          ...filters,
                          amenities:
                            filters.amenities?.filter(
                              (a) => a !== amenity
                            ) || [],
                        });
                      }
                    }}
                  />
                  <label htmlFor={amenity} className="text-sm">
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          {viewMode === "map" ? (
            <div className="h-[600px] rounded-xl border bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">
                Map view - requires Mapbox/Leaflet token
              </p>
            </div>
          ) : (
            <>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <PropertyCardSkeleton key={i} />
                  ))}
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center py-20 space-y-4">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="text-lg font-semibold">
                    {t("search.no_results_title")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("search.no_results_desc")}
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    {t("search.clear_filters")}
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {properties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                      />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => setPage(page - 1)}
                      >
                        {t("common.previous")}
                      </Button>
                      {Array.from(
                        { length: Math.min(totalPages, 5) },
                        (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <Button
                              key={pageNum}
                              variant={
                                page === pageNum ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setPage(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages}
                        onClick={() => setPage(page + 1)}
                      >
                        {t("common.next")}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
