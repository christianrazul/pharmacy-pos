"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function logout() {
    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <Button
      variant="ghost"
      size="compact"
      onClick={logout}
      disabled={isLoggingOut}
      data-state={isLoggingOut ? "loading" : "default"}
    >
      {isLoggingOut ? (
        "Signing out…"
      ) : (
        <>
          <LogOut aria-hidden="true" />
          Sign out
        </>
      )}
    </Button>
  );
}
