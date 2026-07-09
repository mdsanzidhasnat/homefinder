"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/store";
import { BD_LOCATIONS } from "@/lib/utils/bd-locations";
import { Loader2, Save } from "lucide-react";
import type { Property } from "@/types";

const AMENITIES_OPTIONS = [
  "Gas line",
  "Lift",
  "Generator",
  "Parking",
  "Security",
  "Community facilities",
];

export function EditListingPage() {
  const locale = useLocale();
  const t = useTranslations("dashboard.agent");
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const user = useAuthStore((s) => s.user);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>(null);

  const listingId = params?.id as string;

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("listings")
          .select("*")
          .eq("id", listingId)
          .single();
        if (data) {
          const l = data as unknown as Property;
          setForm({
            title_bn: l.title_bn,
            title_en: l.title_en,
            type: l.type,
            purpose: l.purpose,
            description_bn: l.description_bn,
            description_en: l.description_en,
            bedrooms: l.bedrooms.toString(),
            bathrooms: l.bathrooms.toString(),
            floor_number: l.floor_number?.toString() || "",
            total_floors: l.total_floors?.toString() || "",
            facing_direction: l.facing_direction || "",
            amenities: l.amenities,
            division: l.location.division,
            district: l.location.district,
            area_name: l.location.area,
            lat: l.location.lat.toString(),
            lng: l.location.lng.toString(),
            price: l.price.toString(),
            area: l.area.toString(),
            area_unit: l.area_unit,
            status: l.status,
          });
        }
      } catch {
        toast({ title: "Error", description: "Failed to load listing", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [listingId]);

  const handleSave = async () => {
    if (!form || !user) return;
    setSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("listings")
        .update({
          title_bn: form.title_bn,
          title_en: form.title_en,
          type: form.type,
          purpose: form.purpose,
          description_bn: form.description_bn,
          description_en: form.description_en,
          bedrooms: Number(form.bedrooms),
          bathrooms: Number(form.bathrooms),
          floor_number: form.floor_number ? Number(form.floor_number) : null,
          total_floors: form.total_floors ? Number(form.total_floors) : null,
          facing_direction: form.facing_direction || null,
          amenities: form.amenities,
          division: form.division,
          district: form.district,
          area_name: form.area_name,
          lat: Number(form.lat),
          lng: Number(form.lng),
          price: Number(form.price),
          area: Number(form.area),
          area_unit: form.area_unit,
          status: form.status,
        })
        .eq("id", listingId);
      if (error) throw error;
      toast({ title: t("listing_updated"), variant: "success" });
      router.push(`/${locale}/dashboard/listings`);
    } catch {
      toast({ title: "Error", description: "Failed to update listing", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!form) {
    return <div className="text-center py-20 text-muted-foreground">Listing not found</div>;
  }

  const divisions = BD_LOCATIONS;
  const districts = divisions.find((d) => d.value === form.division)?.districts || [];
  const areas = districts.find((d) => d.value === form.district)?.areas || [];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">{t("edit_listing")}</h1>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title (Bangla)</Label>
              <Input value={form.title_bn} onChange={(e) => setForm({ ...form, title_bn: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Title (English)</Label>
              <Input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="office">Office</SelectItem>
                  <SelectItem value="shop">Shop</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="negotiation">Under Negotiation</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Bedrooms</Label>
              <Input type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Bathrooms</Label>
              <Input type="number" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price (BDT)</Label>
              <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Area</Label>
                <Input type="number" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <Select value={form.area_unit} onValueChange={(v) => setForm({ ...form, area_unit: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sqft">Sqft</SelectItem>
                    <SelectItem value="katha">Katha</SelectItem>
                    <SelectItem value="bigha">Bigha</SelectItem>
                    <SelectItem value="decimal">Decimal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Division</Label>
              <Select value={form.division} onValueChange={(v) => setForm({ ...form, division: v, district: "", area_name: "" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {divisions.map((d) => (
                    <SelectItem key={d.value} value={d.value}>{locale === "bn" ? d.label_bn : d.label_en}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>District</Label>
              <Select value={form.district} onValueChange={(v) => setForm({ ...form, district: v, area_name: "" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {districts.map((d) => (
                    <SelectItem key={d.value} value={d.value}>{locale === "bn" ? d.label_bn : d.label_en}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Area</Label>
              <Select value={form.area_name} onValueChange={(v) => setForm({ ...form, area_name: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {areas.map((a) => (
                    <SelectItem key={a.value} value={a.value}>{locale === "bn" ? a.label_bn : a.label_en}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Amenities</Label>
            <div className="grid grid-cols-2 gap-2">
              {AMENITIES_OPTIONS.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2">
                  <Checkbox
                    id={`edit-amenity-${amenity}`}
                    checked={form.amenities.includes(amenity)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setForm({ ...form, amenities: [...form.amenities, amenity] });
                      } else {
                        setForm({ ...form, amenities: form.amenities.filter((a: string) => a !== amenity) });
                      }
                    }}
                  />
                  <label htmlFor={`edit-amenity-${amenity}`} className="text-sm">{amenity}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description (Bangla)</Label>
            <Textarea rows={4} value={form.description_bn} onChange={(e) => setForm({ ...form, description_bn: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Description (English)</Label>
            <Textarea rows={4} value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
