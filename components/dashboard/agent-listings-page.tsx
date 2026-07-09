"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils/price-formatter";
import { useToast } from "@/components/ui/use-toast";
import type { Property } from "@/types";
import { Building2, PlusCircle, Search, Trash2, Edit, ExternalLink } from "lucide-react";

export function AgentListingsPage() {
  const locale = useLocale();
  const t = useTranslations("dashboard.agent");
  const ct = useTranslations("common");
  const user = useAuthStore((s) => s.user);
  const { toast } = useToast();

  const [listings, setListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetch = async () => {
      if (!user) return;
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("listings")
          .select("*")
          .eq("agent_id", user.id)
          .order("created_at", { ascending: false });
        if (data) setListings(data as unknown as Property[]);
      } catch {
        console.error("Failed to fetch listings");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      const supabase = createClient();
      await supabase.from("listings").delete().eq("id", id);
      setListings((prev) => prev.filter((l) => l.id !== id));
      toast({
        title: ct("success"),
        description: t("listing_deleted"),
        variant: "default",
      });
    } catch {
      toast({
        title: ct("error"),
        description: ct("errors.generic"),
        variant: "destructive",
      });
    }
  };

  const filtered = listings.filter((l) => {
    const title = locale === "bn" ? l.title_bn : l.title_en;
    const matchesSearch = title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge variant="success">Available</Badge>;
      case "negotiation":
        return <Badge variant="warning">Negotiation</Badge>;
      case "sold":
      case "rented":
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("my_listings")}</h1>
        <Link href={`/${locale}/dashboard/listings/new`}>
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            {t("create_listing")}
          </Button>
        </Link>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={ct("search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="negotiation">Negotiation</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
            <SelectItem value="rented">Rented</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              {ct("loading")}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">{t("no_listings")}</p>
              <Link href={`/${locale}/dashboard/listings/new`}>
                <Button>{t("create_first")}</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {filtered.map((listing) => (
                <div
                  key={listing.id}
                  className="flex items-center justify-between p-4 gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium truncate">
                        {locale === "bn"
                          ? listing.title_bn
                          : listing.title_en}
                      </p>
                      {getStatusBadge(listing.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        {listing.purpose === "sale" ? "Sale" : "Rent"}
                      </span>
                      <span>
                        {listing.bedrooms} bed, {listing.bathrooms} bath
                      </span>
                      <span>
                        {listing.location.area}, {listing.location.district}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-primary">
                      {formatPrice(listing.price, locale)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {listing.views} views
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/${locale}/property/${listing.id}`}
                    >
                      <Button variant="ghost" size="icon">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link
                      href={`/${locale}/dashboard/listings/${listing.id}/edit`}
                    >
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(listing.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
