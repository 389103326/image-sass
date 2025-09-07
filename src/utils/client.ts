import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../server/router";

export const trpcClient = createTRPCClient<AppRouter>({
  links: [httpBatchLink({ url: "http://localhost:3000/api/trpc" })],
});

export const trpcReact = createTRPCReact<AppRouter>();
export const trpcReactClient = trpcReact.createClient({
  links: [httpBatchLink({ url: "http://localhost:3000/api/trpc" })],
});