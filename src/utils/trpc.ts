import { initTRPC } from "@trpc/server";
import { createTRPCContext } from "@trpc/tanstack-react-query";

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<typeof createTRPCContext>().create();

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;

export const testRouter = router({
  hello: publicProcedure.query(async ({ ctx }) => {
    console.log("ctx", ctx);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      hello: "world",
    };
  }),
});
export type TestRouter = typeof testRouter;
