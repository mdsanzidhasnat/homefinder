"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/lib/supabase/client";
import { Loader2, UserPlus } from "lucide-react";

export function RegisterPage() {
  const locale = useLocale();
  const t = useTranslations("auth");
  const ct = useTranslations("common");
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"buyer" | "agent">("buyer");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const supabase = createClient();

      const { data: authData, error: authError } = await supabase.auth.signUp(
        {
          email,
          password,
        }
      );

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          user_id: authData.user.id,
          name,
          email,
          role,
        } as any);

        if (profileError) throw profileError;
      }

      toast({
        title: ct("success"),
        description: t("register_success"),
        variant: "success",
      });

      router.push(`/${locale}/dashboard`);
    } catch (err: any) {
      toast({
        title: ct("error"),
        description:
          err?.message?.includes("already") || err?.code === "23505"
            ? t("error_email_exists")
            : ct("errors.generic"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t("register_title")}</CardTitle>
          <CardDescription>{t("register_subtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("name")}</Label>
              <Input
                id="name"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("role")}</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={role === "buyer" ? "default" : "outline"}
                  onClick={() => setRole("buyer")}
                  className="h-auto py-3"
                >
                  {t("role_buyer")}
                </Button>
                <Button
                  type="button"
                  variant={role === "agent" ? "default" : "outline"}
                  onClick={() => setRole("agent")}
                  className="h-auto py-3"
                >
                  {t("role_agent")}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <UserPlus className="h-4 w-4 mr-2" />
              )}
              {t("register_button")}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {t("has_account")}{" "}
            <Link
              href={`/${locale}/auth/login`}
              className="text-primary hover:underline font-medium"
            >
              {t("login_button")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
