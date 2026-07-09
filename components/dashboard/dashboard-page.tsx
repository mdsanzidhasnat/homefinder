"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyCard } from "@/components/shared/property-card";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/store";
import type { Property } from "@/types";
import {
  Building2,
  Eye,
  MessageSquare,
  TrendingUp,
  Heart,
  Search,
  PlusCircle,
  User,
} from "lucide-react";

export function DashboardPage() {
  const locale = useLocale();
  const t = useTranslations("dashboard");
  const user = useAuthStore((s) => s.user);
  const isAgent = user?.role === "agent";

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    views: 0,
    inquiries: 0,
  });
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [recentListings, setRecentListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();

        if (isAgent && user) {
          const { data: listings } = await supabase
            .from("listings")
            .select("*")
            .eq("agent_id", user.id);
          const all = (listings || []) as unknown as Property[];
          setStats({
            total: all.length,
            active: all.filter((l) => l.status === "available").length,
            views: all.reduce((sum, l) => sum + (l.views || 0), 0),
            inquiries: 0,
          });
          setRecentListings(all.slice(0, 6));
        } else if (user) {
          const { data: favs } = await supabase
            .from("favorites")
            .select("property_id")
            .eq("user_id", user.id)
            .limit(6);

          if (favs?.length) {
            const ids = favs.map((f) => f.property_id);
            const { data: props } = await supabase
              .from("listings")
              .select("*")
              .in("id", ids);
            if (props)
              setFavorites(props as unknown as Property[]);
          }
        }
      } catch {
        console.error("Dashboard data error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, isAgent]);

  if (!user) {
    return (
      <div className="text-center py-20">
        <p>Please login to view dashboard</p>
      </div>
    );
  }

  if (isAgent) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t("agent.title")}</h1>
          <Link href={`/${locale}/dashboard/listings/new`}>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              {t("agent.create_listing")}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("agent.total_listings")}
              </CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("agent.active_listings")}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-emerald-600">
                {stats.active}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("agent.total_views")}
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.views}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t("agent.total_inquiries")}
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.inquiries}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("agent.my_listings")}</CardTitle>
          </CardHeader>
          <CardContent>
            {recentListings.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">
                  {t("agent.no_listings")}
                </p>
                <Link href={`/${locale}/dashboard/listings/new`}>
                  <Button>{t("agent.create_first")}</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">
                        {locale === "bn"
                          ? listing.title_bn
                          : listing.title_en}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {listing.location.area},{" "}
                        {listing.location.district}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/${locale}/dashboard/listings/${listing.id}/edit`}
                      >
                        <Button variant="outline" size="sm">
                          {locale === "bn" ? "সম্পাদনা" : "Edit"}
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
                {recentListings.length >= 6 && (
                  <Link href={`/${locale}/dashboard/listings`}>
                    <Button variant="ghost" size="sm" className="w-full">
                      {locale === "bn" ? "সব দেখুন" : "View All"}
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("buyer.title")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t("buyer.saved_properties")}</CardTitle>
            <Link href={`/${locale}/search`}>
              <Button variant="outline" size="sm">
                {t("buyer.browse_properties")}
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {favorites.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">
                  {t("buyer.no_saved")}
                </p>
                <Link href={`/${locale}/search`}>
                  <Button>{t("buyer.browse_properties")}</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {favorites.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("buyer.saved_searches")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Search className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {t("buyer.no_searches")}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t("buyer.my_inquiries")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {t("buyer.no_inquiries")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
