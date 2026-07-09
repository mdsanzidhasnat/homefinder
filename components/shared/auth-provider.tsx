"use client";

import { useEffect } from "react";
import { useRouter } from "@/lib/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: profile?.name || session.user.email!.split("@")[0],
          role: (profile?.role as "buyer" | "agent") || "buyer",
          avatar_url: profile?.avatar_url,
        });
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: profile?.name || session.user.email!.split("@")[0],
          role: (profile?.role as "buyer" | "agent") || "buyer",
          avatar_url: profile?.avatar_url,
        });
        router.refresh();
      } else if (event === "SIGNED_OUT") {
        clearUser();
        router.refresh();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return <>{children}</>;
}
