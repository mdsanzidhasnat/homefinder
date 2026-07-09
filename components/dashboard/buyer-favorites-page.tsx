"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/shared/property-card";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/store";
import { useFavoriteStore } from "@/lib/store";
import type { Property } from "@/types";
import { Heart } from "lucide-react";
import { Link } from "@/lib/navigation";

export function BuyerFavoritesPage() {
  const locale = useLocale();
  const t = useTranslations("dashboard.buyer");
  const user = useAuthStore((s) => s.user);
  const favorites = useFavoriteStore((s) => s.favorites);

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user || favorites.size === 0) {
        setLoading(false);
        return;
      }
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("listings")
          .select("*")
          .in("id", Array.from(favorites));
        if (data) setProperties(data as unknown as Property[]);
      } catch {
        console.error("Failed to fetch favorites");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [user, favorites]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("saved_properties")}</h1>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Loading...</div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">{t("no_saved")}</p>
          <Link href={`/${locale}/search`}>
            <Button>{t("browse_properties")}</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
