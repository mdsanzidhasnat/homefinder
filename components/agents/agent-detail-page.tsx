"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/shared/property-card";
import { PropertyCardSkeleton } from "@/components/shared/property-card-skeleton";
import { createClient } from "@/lib/supabase/client";
import type { Profile, Property } from "@/types";
import { Phone, Mail, Building2, Calendar, MapPin } from "lucide-react";

export function AgentDetailPage() {
  const locale = useLocale();
  const t = useTranslations("agent");
  const params = useParams();
  const agentId = params?.id as string;

  const [agent, setAgent] = useState<Profile | null>(null);
  const [listings, setListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const supabase = createClient();
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", agentId)
          .single();
        if (profile) setAgent(profile as unknown as Profile);

        const { data: agentListings } = await supabase
          .from("listings")
          .select("*")
          .eq("agent_id", agentId)
          .order("posted_date", { ascending: false });
        if (agentListings)
          setListings(agentListings as unknown as Property[]);
      } catch {
        console.error("Failed to fetch agent");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [agentId]);

  if (loading) {
    return (
      <div className="container-page py-8 space-y-8">
        <div className="flex gap-6">
          <div className="w-24 h-24 rounded-full skeleton" />
          <div className="space-y-3 flex-1">
            <div className="h-6 skeleton w-1/3" />
            <div className="h-4 skeleton w-1/4" />
            <div className="h-4 skeleton w-1/2" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="container-page py-20 text-center text-muted-foreground">
        Agent not found
      </div>
    );
  }

  return (
    <div className="container-page py-8 space-y-8">
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <Avatar className="h-24 w-24">
          <AvatarImage src={agent.avatar_url || ""} />
          <AvatarFallback className="text-2xl bg-primary/10 text-primary">
            {agent.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2 flex-1">
          <h1 className="text-2xl font-bold">{agent.name}</h1>
          {agent.agency_name && (
            <p className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              {agent.agency_name}
            </p>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {agent.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {agent.phone}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {agent.email}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {t("member_since")}{" "}
              {new Date(agent.created_at).toLocaleDateString(
                locale === "bn" ? "bn-BD" : "en-US"
              )}
            </span>
          </div>
          <div className="flex gap-4 pt-2">
            <div className="text-center">
              <p className="text-2xl font-bold">{listings.length}</p>
              <p className="text-xs text-muted-foreground">
                {t("total_properties")}
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {listings.filter((l) => l.status === "available").length}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("active_listings")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">{t("view_listings")}</h2>
        {listings.length === 0 ? (
          <p className="text-muted-foreground">{t("no_listings")}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
