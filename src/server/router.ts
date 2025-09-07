import { fileRoute } from "./routes/file";
import { router } from "./trpc";

export const appRouter = router({
  file: fileRoute
})

export type AppRouter = typeof appRouter;