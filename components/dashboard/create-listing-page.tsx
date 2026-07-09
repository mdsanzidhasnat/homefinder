"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Check,
  Upload,
  X,
  ImagePlus,
} from "lucide-react";

const PROPERTY_TYPES = [
  { value: "apartment", label_bn: "অ্যাপার্টমেন্ট/ফ্ল্যাট", label_en: "Apartment/Flat" },
  { value: "house", label_bn: "স্বতন্ত্র বাড়ি", label_en: "Independent House" },
  { value: "land", label_bn: "জমি/প্লট", label_en: "Land/Plot" },
  { value: "commercial", label_bn: "বাণিজ্যিক স্থান", label_en: "Commercial Space" },
  { value: "office", label_bn: "অফিস স্থান", label_en: "Office Space" },
  { value: "shop", label_bn: "দোকান", label_en: "Shop" },
  { value: "warehouse", label_bn: "গোডাউন", label_en: "Warehouse" },
];

const AMENITIES_OPTIONS = [
  "Gas line",
  "Lift",
  "Generator",
  "Parking",
  "Security",
  "Community facilities",
];

export function CreateListingPage() {
  const locale = useLocale();
  const t = useTranslations("dashboard.agent");
  const router = useRouter();
  const { toast } = useToast();
  const user = useAuthStore((s) => s.user);

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title_bn: "",
    title_en: "",
    type: "",
    purpose: "",
    description_bn: "",
    description_en: "",
    bedrooms: "0",
    bathrooms: "0",
    floor_number: "",
    total_floors: "",
    facing_direction: "",
    amenities: [] as string[],
    division: "",
    district: "",
    area_name: "",
    lat: "23.8103",
    lng: "90.4125",
    price: "",
    area: "",
    area_unit: "sqft",
  });

  const divisions = BD_LOCATIONS;
  const districts = divisions.find((d) => d.value === form.division)?.districts || [];
  const areas = districts.find((d) => d.value === form.district)?.areas || [];

  const steps = [
    { label: t("step_basic"), number: 0 },
    { label: t("step_location"), number: 1 },
    { label: t("step_pricing"), number: 2 },
    { label: t("step_review"), number: 3 },
  ];

  const validateStep = (s: number) => {
    switch (s) {
      case 0:
        return form.title_bn.length >= 5 && form.title_en.length >= 5 && form.type && form.purpose;
      case 1:
        return form.division && form.district && form.area_name;
      case 2:
        return Number(form.price) > 0 && Number(form.area) > 0;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      const supabase = createClient();

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      const listingData = {
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
        status: "available",
        agent_id: user.id,
        agent_name: profile?.name || user.name,
        agent_phone: profile?.phone || "",
        agent_email: user.email,
        images: [],
        views: 0,
      };

      const { error } = await supabase.from("listings").insert(listingData);
      if (error) throw error;

      toast({
        title: t("listing_created"),
        variant: "success",
      });
      router.push(`/${locale}/dashboard/listings`);
    } catch {
      toast({
        title: "Error",
        description: "Failed to create listing",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Title (Bangla) *</Label>
              <Input
                value={form.title_bn}
                onChange={(e) => setForm({ ...form, title_bn: e.target.value })}
                placeholder="যেমন: গুলশানে ৩ বেডরুমের আধুনিক ফ্ল্যাট"
              />
            </div>
            <div className="space-y-2">
              <Label>Title (English) *</Label>
              <Input
                value={form.title_en}
                onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                placeholder="e.g., Modern 3BR Apartment in Gulshan"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type *</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => setForm({ ...form, type: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map((pt) => (
                      <SelectItem key={pt.value} value={pt.value}>
                        {locale === "bn" ? pt.label_bn : pt.label_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Purpose *</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={form.purpose === "sale" ? "default" : "outline"}
                    onClick={() => setForm({ ...form, purpose: "sale" })}
                    className="flex-1"
                  >
                    Sale
                  </Button>
                  <Button
                    type="button"
                    variant={form.purpose === "rent" ? "default" : "outline"}
                    onClick={() => setForm({ ...form, purpose: "rent" })}
                    className="flex-1"
                  >
                    Rent
                  </Button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bedrooms</Label>
                <Input
                  type="number"
                  value={form.bedrooms}
                  onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Bathrooms</Label>
                <Input
                  type="number"
                  value={form.bathrooms}
                  onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Floor Number</Label>
                <Input
                  type="number"
                  value={form.floor_number}
                  onChange={(e) => setForm({ ...form, floor_number: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Total Floors</Label>
                <Input
                  type="number"
                  value={form.total_floors}
                  onChange={(e) => setForm({ ...form, total_floors: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Facing Direction</Label>
              <Select
                value={form.facing_direction}
                onValueChange={(v) => setForm({ ...form, facing_direction: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="north">North</SelectItem>
                  <SelectItem value="south">South</SelectItem>
                  <SelectItem value="east">East</SelectItem>
                  <SelectItem value="west">West</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 gap-2">
                {AMENITIES_OPTIONS.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2">
                    <Checkbox
                      id={`amenity-${amenity}`}
                      checked={form.amenities.includes(amenity)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setForm({ ...form, amenities: [...form.amenities, amenity] });
                        } else {
                          setForm({ ...form, amenities: form.amenities.filter((a) => a !== amenity) });
                        }
                      }}
                    />
                    <label htmlFor={`amenity-${amenity}`} className="text-sm">
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description (Bangla) *</Label>
              <Textarea
                rows={4}
                value={form.description_bn}
                onChange={(e) => setForm({ ...form, description_bn: e.target.value })}
                placeholder="প্রপার্টি সম্পর্কে বিস্তারিত বর্ণনা দিন"
              />
            </div>
            <div className="space-y-2">
              <Label>Description (English) *</Label>
              <Textarea
                rows={4}
                value={form.description_en}
                onChange={(e) => setForm({ ...form, description_en: e.target.value })}
                placeholder="Provide detailed description of the property"
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Division *</Label>
              <Select
                value={form.division}
                onValueChange={(v) => setForm({ ...form, division: v, district: "", area_name: "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select division" />
                </SelectTrigger>
                <SelectContent>
                  {divisions.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {locale === "bn" ? d.label_bn : d.label_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {form.division && (
              <div className="space-y-2">
                <Label>District *</Label>
                <Select
                  value={form.district}
                  onValueChange={(v) => setForm({ ...form, district: v, area_name: "" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {locale === "bn" ? d.label_bn : d.label_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {form.district && (
              <div className="space-y-2">
                <Label>Area *</Label>
                <Select
                  value={form.area_name}
                  onValueChange={(v) => setForm({ ...form, area_name: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((a) => (
                      <SelectItem key={a.value} value={a.value}>
                        {locale === "bn" ? a.label_bn : a.label_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Latitude</Label>
                <Input
                  type="number"
                  step="any"
                  value={form.lat}
                  onChange={(e) => setForm({ ...form, lat: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Longitude</Label>
                <Input
                  type="number"
                  step="any"
                  value={form.lng}
                  onChange={(e) => setForm({ ...form, lng: e.target.value })}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Price (BDT) *</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="e.g., 10000000"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Area *</Label>
                <Input
                  type="number"
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Area Unit *</Label>
                <Select
                  value={form.area_unit}
                  onValueChange={(v) => setForm({ ...form, area_unit: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sqft">Sq. Feet</SelectItem>
                    <SelectItem value="katha">Katha</SelectItem>
                    <SelectItem value="bigha">Bigha</SelectItem>
                    <SelectItem value="decimal">Decimal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg">Review Your Listing</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Title (Bangla)</p>
                <p className="font-medium">{form.title_bn}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Title (English)</p>
                <p className="font-medium">{form.title_en}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium capitalize">{form.type}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Purpose</p>
                <p className="font-medium capitalize">{form.purpose}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Bedrooms</p>
                <p className="font-medium">{form.bedrooms}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Bathrooms</p>
                <p className="font-medium">{form.bathrooms}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="font-medium">BDT {Number(form.price).toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Area</p>
                <p className="font-medium">
                  {form.area} {form.area_unit}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium capitalize">
                  {form.area_name}, {form.district}, {form.division}
                </p>
              </div>
            </div>
            {form.amenities.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {form.amenities.map((a) => (
                    <Badge key={a} variant="secondary">{a}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">{t("create_listing")}</h1>

      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step > i
                  ? "bg-primary text-primary-foreground"
                  : step === i
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step > i ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={`text-sm hidden sm:inline ${
                step === i ? "font-medium" : "text-muted-foreground"
              }`}
            >
              {s.label}
            </span>
            {i < steps.length - 1 && <div className="flex-1 h-px bg-border" />}
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">{renderStep()}</CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          {locale === "bn" ? "পূর্ববর্তী" : "Previous"}
        </Button>
        {step < 3 ? (
          <Button
            onClick={() => setStep(Math.min(3, step + 1))}
            disabled={!validateStep(step)}
          >
            {locale === "bn" ? "পরবর্তী" : "Next"}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {locale === "bn" ? "প্রকাশ করুন" : "Publish Listing"}
          </Button>
        )}
      </div>
    </div>
  );
}
