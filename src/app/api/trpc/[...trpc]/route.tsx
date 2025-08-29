import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { NextRequest } from 'next/server';
import { testRouter } from '@/utils/trpc';

export const handler = (request: NextRequest) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: testRouter,
    createContext: () => ({})
  });
}; 

export { handler as POST, handler as GET }
