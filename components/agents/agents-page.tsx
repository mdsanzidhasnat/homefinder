"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";
import { Search, Phone, Mail, Building2 } from "lucide-react";

export function AgentsPage() {
  const locale = useLocale();
  const t = useTranslations("agent");
  const ct = useTranslations("common");
  const [agents, setAgents] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("role", "agent")
          .limit(20);
        if (data) setAgents(data as Profile[]);
      } catch {
        console.error("Failed to fetch agents");
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  const filtered = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.agency_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-page py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          {t("subtitle")}
        </p>
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={ct("search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full skeleton" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 skeleton w-2/3" />
                    <div className="h-3 skeleton w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 skeleton w-full" />
                  <div className="h-3 skeleton w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          {ct("no_results")}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((agent) => (
            <Link key={agent.id} href={`/${locale}/agents/${agent.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={agent.avatar_url || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {agent.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{agent.name}</h3>
                      {agent.agency_name && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {agent.agency_name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {agent.phone && (
                      <p className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        {agent.phone}
                      </p>
                    )}
                    <p className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      {agent.email}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    {t("view_listings")}
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
