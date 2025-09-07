import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { NextRequest } from 'next/server';
import { appRouter, createTRPCContext } from "@/utils/trpc-ssc";

// context 可以用来传递一些全局的变量、信息，比如用户信息、数据库连接等
export const handler = (request: NextRequest) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: createTRPCContext,
  });
}; 

export { handler as POST, handler as GET }
