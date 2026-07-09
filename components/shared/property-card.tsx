"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Bed, Bath, Square } from "lucide-react";
import { formatPrice } from "@/lib/utils/price-formatter";
import type { Property } from "@/types";
import { useFavoriteStore } from "@/lib/store";
import { useState } from "react";

interface PropertyCardProps {
  property: Property;
}

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23e2e8f0' width='400' height='300'/%3E%3Ctext fill='%2394a3b8' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='18'%3ENo Image%3C/text%3E%3C/svg%3E";

export function PropertyCard({ property }: PropertyCardProps) {
  const locale = useLocale();
  const t = useTranslations();
  const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();
  const [imgError, setImgError] = useState(false);
  const [isFav, setIsFav] = useState(isFavorite(property.id));

  const title = locale === "bn" ? property.title_bn : property.title_en;
  const primaryImg = property.images?.find((i) => i.is_primary)?.url || property.images?.[0]?.url;

  const toggleFav = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFav) {
      removeFavorite(property.id);
      setIsFav(false);
    } else {
      addFavorite(property.id);
      setIsFav(true);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "available":
        return "success" as const;
      case "negotiation":
        return "warning" as const;
      case "sold":
      case "rented":
        return "destructive" as const;
      default:
        return "secondary" as const;
    }
  };

  return (
    <Link href={`/${locale}/property/${property.id}`}>
      <div className="property-card-shadow group rounded-xl border bg-card overflow-hidden">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={imgError || !primaryImg ? PLACEHOLDER_IMG : primaryImg}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImgError(true)}
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant={property.purpose === "sale" ? "default" : "secondary"}>
              {property.purpose === "sale"
                ? t("property.for_sale")
                : t("property.for_rent")}
            </Badge>
            {property.status !== "available" && (
              <Badge variant={getStatusVariant(property.status)}>
                {t(`property.${property.status}`)}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFav}
            className="absolute top-3 right-3 h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
          >
            <Heart
              className={`h-4 w-4 ${isFav ? "fill-red-500 text-red-500" : ""}`}
            />
          </Button>
        </div>
        <div className="p-4 space-y-3">
          <div className="space-y-1">
            <h3 className="font-semibold text-base leading-tight line-clamp-1">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="line-clamp-1">
                {property.location.area}, {property.location.district}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {property.bedrooms > 0 && (
              <span className="flex items-center gap-1">
                <Bed className="h-3.5 w-3.5" />
                {property.bedrooms}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5" />
              {property.bathrooms}
            </span>
            <span className="flex items-center gap-1">
              <Square className="h-3.5 w-3.5" />
              {property.area} {property.area_unit}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-lg font-bold text-primary">
              {formatPrice(property.price, locale)}
            </span>
            {property.purpose === "rent" && (
              <span className="text-xs text-muted-foreground">/month</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
