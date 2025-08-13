"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/app/lib/api";
import { toast } from "sonner";

const AppCtx = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load session from localStorage (demo only)
  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("shopease_session") : null;
    if (raw) {
      try {
        const s = JSON.parse(raw);
        setUser(s.user || null);
        setToken(s.token || null);
      } catch {}
    }
  }, []);

  const saveSession = (u, t) => {
    setUser(u || null);
    setToken(t || null);
    if (typeof window !== "undefined") {
      localStorage.setItem("shopease_session", JSON.stringify({ user: u, token: t }));
    }
  };

  const clearSession = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== "undefined") localStorage.removeItem("shopease_session");
  };

  const signup = async ({ name, email, phone }) => {
    setLoading(true);
    try {
      const resp = await api.auth.signup({ name, email, phone });
      toast.success("OTP sent (mock: 123456)");
      return resp;
    } finally {
      setLoading(false);
    }
  };

  const verify = async ({ email, otp }) => {
    setLoading(true);
    try {
      const { user: u, token: t } = await api.auth.verify({ email, otp });
      saveSession(u, t);
      toast.success("Verified. Full access unlocked.");
      return { user: u, token: t };
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({ user, token, loading, signup, verify, logout: clearSession }),
    [user, token, loading]
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export const useApp = () => useContext(AppCtx);
