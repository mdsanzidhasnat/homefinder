"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PropertyCard } from "@/components/shared/property-card";
import { PropertyCardSkeleton } from "@/components/shared/property-card-skeleton";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils/price-formatter";
import { useFavoriteStore, useAuthStore } from "@/lib/store";
import { useToast } from "@/components/ui/use-toast";
import type { Property } from "@/types";
import {
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Square,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Building2,
  Phone,
  Mail,
  Send,
  Loader2,
} from "lucide-react";

const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect fill='%23e2e8f0' width='800' height='600'/%3E%3Ctext fill='%2394a3b8' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-size='24'%3ENo Image%3C/text%3E%3C/svg%3E";

export function PropertyDetailPage() {
  const locale = useLocale();
  const t = useTranslations();
  const params = useParams();
  const { toast } = useToast();
  const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();
  const user = useAuthStore((s) => s.user);

  const [property, setProperty] = useState<Property | null>(null);
  const [similar, setSimilar] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const propertyId = params?.id as string;

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("listings")
          .select("*")
          .eq("id", propertyId)
          .single();

        if (data) {
          setProperty(data as unknown as Property);
          await supabase
            .from("listings")
            .update({ views: (data.views || 0) + 1 })
            .eq("id", propertyId);

          const { data: similarData } = await supabase
            .from("listings")
            .select("*")
            .eq("purpose", data.purpose)
            .neq("id", propertyId)
            .limit(4);
          if (similarData)
            setSimilar(similarData as unknown as Property[]);
        }
      } catch {
        console.error("Failed to fetch property");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [propertyId]);

  const allImages = property?.images?.length
    ? property.images
    : [{ id: "placeholder", url: PLACEHOLDER_IMG, is_primary: true }];

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    setSending(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("inquiries").insert({
        property_id: property.id,
        property_title: locale === "bn" ? property.title_bn : property.title_en,
        sender_name: contactForm.name,
        sender_email: contactForm.email,
        sender_phone: contactForm.phone,
        message: contactForm.message,
        sender_id: user?.id || "",
      });
      if (error) throw error;
      toast({
        title: t("common.success"),
        description: t("property.message_sent"),
        variant: "success",
      });
      setContactForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch {
      toast({
        title: t("common.error"),
        description: t("errors.generic"),
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const toggleFav = async () => {
    if (!property) return;
    if (isFavorite(property.id)) {
      removeFavorite(property.id);
    } else {
      addFavorite(property.id);
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

  if (loading) {
    return (
      <div className="container-page py-8 space-y-8">
        <div className="h-[400px] skeleton rounded-xl" />
        <div className="h-8 skeleton w-1/3" />
        <div className="h-4 skeleton w-1/2" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-20 skeleton rounded-lg" />
          <div className="h-20 skeleton rounded-lg" />
          <div className="h-20 skeleton rounded-lg" />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container-page py-20 text-center space-y-4">
        <Building2 className="h-16 w-16 mx-auto text-muted-foreground" />
        <h2 className="text-2xl font-bold">{t("common.not_found")}</h2>
        <p className="text-muted-foreground">
          {t("common.not_found_desc")}
        </p>
      </div>
    );
  }

  const title = locale === "bn" ? property.title_bn : property.title_en;
  const description =
    locale === "bn"
      ? property.description_bn
      : property.description_en;

  return (
    <div className="container-page py-8 space-y-8">
      <div className="relative rounded-xl overflow-hidden bg-muted">
        <div className="relative aspect-[16/9] md:aspect-[21/9]">
          <Image
            src={allImages[currentImage]?.url || PLACEHOLDER_IMG}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        {allImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80"
              onClick={() =>
                setCurrentImage(
                  (prev) =>
                    (prev - 1 + allImages.length) % allImages.length
                )
              }
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80"
              onClick={() =>
                setCurrentImage(
                  (prev) => (prev + 1) % allImages.length
                )
              }
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i === currentImage ? "bg-white" : "bg-white/50"
                  }`}
                  onClick={() => setCurrentImage(i)}
                />
              ))}
            </div>
          </>
        )}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 backdrop-blur-sm"
            onClick={toggleFav}
          >
            <Heart
              className={`h-5 w-5 ${
                isFavorite(property.id) ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 backdrop-blur-sm"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast({
                title: t("common.success"),
                description: "Link copied to clipboard",
              });
            }}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    property.purpose === "sale" ? "default" : "secondary"
                  }
                >
                  {property.purpose === "sale"
                    ? t("property.for_sale")
                    : t("property.for_rent")}
                </Badge>
                <Badge variant={getStatusVariant(property.status)}>
                  {t(`property.${property.status}`)}
                </Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
              <p className="text-muted-foreground flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {property.location.area}, {property.location.district},{" "}
                {property.location.division}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-3xl font-bold text-primary">
                {formatPrice(property.price, locale)}
              </p>
              {property.purpose === "rent" && (
                <p className="text-sm text-muted-foreground">/month</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <Bed className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-lg font-semibold">{property.bedrooms}</p>
              <p className="text-xs text-muted-foreground">
                {t("property.bedrooms")}
              </p>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <Bath className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-lg font-semibold">{property.bathrooms}</p>
              <p className="text-xs text-muted-foreground">
                {t("property.bathrooms")}
              </p>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <Square className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-lg font-semibold">
                {property.area} {property.area_unit}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("property.sqft")}
              </p>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <Building2 className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-lg font-semibold">
                {property.floor_number || "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("property.floor")}
              </p>
            </div>
          </div>

          {property.amenities && property.amenities.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">
                {t("property.amenities")}
              </h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity) => (
                  <Badge key={amenity} variant="secondary">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">
              {t("property.description")}
            </h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">
              {t("property.location")}
            </h2>
            <div className="h-[300px] rounded-xl border bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">
                Map view (Lat: {property.location.lat}, Lng:{" "}
                {property.location.lng})
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                {property.agent_name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold">{property.agent_name}</p>
                <p className="text-sm text-muted-foreground">
                  {t("property.agent")}
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {property.agent_phone}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {property.agent_email}
              </p>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-3 pt-2">
              <h3 className="font-semibold">
                {t("property.contact_form_title")}
              </h3>
              <div className="space-y-2">
                <Label htmlFor="contact-name">
                  {t("property.your_name")}
                </Label>
                <Input
                  id="contact-name"
                  required
                  value={contactForm.name}
                  onChange={(e) =>
                    setContactForm({
                      ...contactForm,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">
                  {t("property.your_email")}
                </Label>
                <Input
                  id="contact-email"
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm({
                      ...contactForm,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-phone">
                  {t("property.your_phone")}
                </Label>
                <Input
                  id="contact-phone"
                  type="tel"
                  required
                  value={contactForm.phone}
                  onChange={(e) =>
                    setContactForm({
                      ...contactForm,
                      phone: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-message">
                  {t("property.your_message")}
                </Label>
                <Textarea
                  id="contact-message"
                  rows={3}
                  required
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm({
                      ...contactForm,
                      message: e.target.value,
                    })
                  }
                />
              </div>
              <Button type="submit" className="w-full" disabled={sending}>
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                {t("property.send_message")}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="space-y-6 pt-8 border-t">
          <h2 className="text-xl font-bold">
            {t("property.similar_properties")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {similar.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
