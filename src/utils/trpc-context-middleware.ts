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

// 中间件用法
const middleware = t.middleware(async ({ next }) => {
  const start = Date.now();

  const result = await next();

  const end = Date.now();
  console.log(`--> API time ${end - start}ms`);

  return result;
});
const loggerProcedure = publicProcedure.use(middleware);

export const testRouter = router({
  hello: loggerProcedure.query(async ({ ctx }) => {
    console.log("ctx", ctx);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      hello: "world",
    };
  }),
});

export type TestRouter = typeof testRouter;
