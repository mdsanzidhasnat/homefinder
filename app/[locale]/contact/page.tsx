"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Send, MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  const locale = useLocale();
  const t = useTranslations("contact");
  const ct = useTranslations("common");
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast({
      title: ct("success"),
      description: t("success"),
      variant: "success",
    });
    setForm({ name: "", email: "", subject: "", message: "" });
    setLoading(false);
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: t("address"),
      value: "House 42, Road 11, Gulshan 1, Dhaka 1212",
    },
    {
      icon: Phone,
      label: t("phone"),
      value: "+880 1700-000000",
    },
    {
      icon: Mail,
      label: t("email_label"),
      value: "info@bdhomefinder.com",
    },
    {
      icon: Clock,
      label: "Office Hours",
      value: "Sat-Thu, 9:00 AM - 6:00 PM",
    },
  ];

  return (
    <div className="container-page py-16">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl font-bold">{t("title")}</h1>
        <p className="text-xl text-muted-foreground">{t("subtitle")}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold">{t("form_title")}</h2>
          <div className="space-y-2">
            <Label htmlFor="name">{t("name")}</Label>
            <Input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">{t("subject")}</Label>
            <Input
              id="subject"
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">{t("message")}</Label>
            <Textarea
              id="message"
              rows={5}
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            {t("send")}
          </Button>
        </form>

        <div className="space-y-6">
          {contactInfo.map((info) => (
            <div key={info.label} className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <info.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{info.label}</p>
                <p className="text-muted-foreground">{info.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
