import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "@/server/auth";
import { z } from "zod";

interface Post {
  id: string;
  title: string;
}

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
    foo: "bar",
  };
};

const t = initTRPC.context<Partial<typeof createTRPCContext>>().create();

const publicProcedure = t.procedure;
const { createCallerFactory, router } = t;


const posts: Post[] = [
  {
    id: "1",
    title: "posts 1",
  },
  {
    id: "2",
    title: "posts 2",
  },
];

export const appRouter = router({
  post: router({
    add: publicProcedure
      .input(
        z.object({
          title: z.string().min(2),
        })
      )
      .mutation((opts) => {
        const post: Post = {
          ...opts.input,
          id: `${Math.random()}`,
        };
        posts.push(post);
        return post;
      }),
    list: publicProcedure.query(() => posts),
  }),
});

export type AppRouter = typeof appRouter;

// 1. create a caller-function for your router
export const createCaller = createCallerFactory(appRouter);
// 2. create a caller using your `Context`
export const caller = createCaller({
  foo: "bar",
});
