import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "@/server/auth";

export const createTRPCContext = async () => {
  const session = await auth();
  console.log("session-->", session);

  if (!session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  return {
    session,
  };
};

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
  hello: publicProcedure.query(({ ctx }) => {
    console.log("ctx", ctx.session);

    return {
      hello: "world",
    };
  }),
});

export type TestRouter = typeof testRouter;
