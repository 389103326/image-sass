import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "@/server/auth";

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context().create();

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;

// 中间件用法
export const withLoggerMiddleware = t.middleware(async ({ next }) => {
  const start = Date.now();
  const result = await next();
  const end = Date.now();
  console.log(`--> API time ${end - start}ms`);

  return result;
});

export const withSessionMiddleware = t.middleware(async ({ next }) => {
  const session = await auth();
  return next({
    ctx: {
      session
    },
  });
});

// 组合中间件，来赋予procedure context等，并且可以导出多种 procedure
export const protectedProcedure = publicProcedure
  .use(withLoggerMiddleware)
  .use(withSessionMiddleware)
  .use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "FORBIDDEN",
    });
  }
  return next({
    ctx: {
      session: ctx.session!
    } 
  });
})
