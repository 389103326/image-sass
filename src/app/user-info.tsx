"use client";

import {
  useSession,
  SessionProvider as NextAuthSessionProvider,
  type SessionProviderProps,
} from "next-auth/react";

export function UserInfo() {
  const session = useSession();
  console.log("UserInfo session", session);

  return <div className="text-2xl">{session?.data?.user?.name}</div>;
}

export function SessionProvider(props: SessionProviderProps) {
  return <NextAuthSessionProvider {...props}></NextAuthSessionProvider>;
}