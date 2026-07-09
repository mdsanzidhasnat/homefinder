"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/store";
import type { Property, Inquiry } from "@/types";
import { MessageSquare, Phone, Mail, Calendar } from "lucide-react";

export function InquiriesPage() {
  const locale = useLocale();
  const t = useTranslations("dashboard.agent");
  const user = useAuthStore((s) => s.user);

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!user) return;
      try {
        const supabase = createClient();
        const { data: listings } = await supabase
          .from("listings")
          .select("id")
          .eq("agent_id", user.id);

        if (listings && listings.length > 0) {
          const ids = listings.map((l) => l.id);
          const { data } = await supabase
            .from("inquiries")
            .select("*")
            .in("property_id", ids)
            .order("created_at", { ascending: false });
          if (data) setInquiries(data as unknown as Inquiry[]);
        }
      } catch {
        console.error("Failed to fetch inquiries");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("inbox")}</h1>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : inquiries.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">No inquiries yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {inquiries.map((inquiry) => (
                <div key={inquiry.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{inquiry.sender_name}</span>
                      {!inquiry.is_read && (
                        <Badge variant="default" className="text-xs">New</Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(inquiry.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Regarding: {inquiry.property_title}
                  </p>
                  <p className="text-sm">{inquiry.message}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {inquiry.sender_email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {inquiry.sender_phone}
                    </span>
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
