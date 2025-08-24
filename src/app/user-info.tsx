"use client";

import { useSession, SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

export function UserInfo() {
  const session = useSession();
  console.log('session', session);

  return <div className='text-2xl'>{session?.data?.user?.name}</div>
}

export function SessionProvider(props: any) {
  return <NextAuthSessionProvider {...props}></NextAuthSessionProvider>
}