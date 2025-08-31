import { createTRPCContext } from '@trpc/tanstack-react-query';
import type { TestRouter } from './trpc-context-middleware';
 
export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<TestRouter>();
