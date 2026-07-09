"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Send } from "lucide-react";

export function ForgotPasswordPage() {
  const locale = useLocale();
  const t = useTranslations("auth");
  const ct = useTranslations("common");
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/${locale}/auth/update-password`,
      });
      if (error) throw error;

      toast({
        title: ct("success"),
        description: t("reset_link_sent"),
        variant: "success",
      });
    } catch {
      toast({
        title: ct("error"),
        description: ct("errors.generic"),
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
          <CardTitle className="text-2xl">
            {t("forgot_password_title")}
          </CardTitle>
          <CardDescription>
            {t("forgot_password_subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {t("forgot_password_button")}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            <Link
              href={`/${locale}/auth/login`}
              className="text-primary hover:underline"
            >
              {t("login_button")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
