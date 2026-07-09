"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/store";
import { Loader2, Save, User } from "lucide-react";

export function SettingsPage() {
  const t = useTranslations("dashboard.buyer");
  const ct = useTranslations("common");
  const { toast } = useToast();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    agency_name: "",
    bio_bn: "",
    bio_en: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();
        if (data) {
          setForm({
            name: data.name || "",
            phone: data.phone || "",
            agency_name: data.agency_name || "",
            bio_bn: data.bio_bn || "",
            bio_en: data.bio_en || "",
          });
        }
      } catch {
        console.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({
          name: form.name,
          phone: form.phone,
          agency_name: form.agency_name || null,
          bio_bn: form.bio_bn || null,
          bio_en: form.bio_en || null,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      setUser({ ...user, name: form.name });
      toast({ title: ct("success"), description: "Profile updated", variant: "success" });
    } catch {
      toast({ title: ct("error"), description: ct("errors.generic"), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{t("profile_settings")}</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar_url || ""} />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{form.name || user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="settings-name">Full Name</Label>
            <Input
              id="settings-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="settings-phone">Phone</Label>
            <Input
              id="settings-phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+880 1XXXXXXXXX"
            />
          </div>
          {user.role === "agent" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="settings-agency">Agency Name</Label>
                <Input
                  id="settings-agency"
                  value={form.agency_name}
                  onChange={(e) => setForm({ ...form, agency_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-bio-bn">Bio (Bangla)</Label>
                <Textarea
                  id="settings-bio-bn"
                  rows={3}
                  value={form.bio_bn}
                  onChange={(e) => setForm({ ...form, bio_bn: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-bio-en">Bio (English)</Label>
                <Textarea
                  id="settings-bio-en"
                  rows={3}
                  value={form.bio_en}
                  onChange={(e) => setForm({ ...form, bio_en: e.target.value })}
                />
              </div>
            </>
          )}

          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
