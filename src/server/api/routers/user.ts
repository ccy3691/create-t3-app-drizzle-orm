import { z } from "zod";
import { User } from "~/db/schema";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { and, asc, desc, eq, or } from "drizzle-orm/expressions";

export const userRouter = createTRPCRouter({
  onboardingStep1: protectedProcedure
    .input(z.object({ nickname: z.string() }))
    .mutation(({ ctx, input }) => {
      const res = ctx.db
        .update(User)
        .set({ nickname: input.nickname, onboardingStep: 2 })
        .where(eq(User.id, ctx.session.user.id))
        .run();

      return res;
    }),

  onboardingStep2: protectedProcedure.mutation(({ ctx }) => {
    const res = ctx.db
      .update(User)
      .set({ hasAgreedToToS: 1, isOnboarded: 1 })
      .where(eq(User.id, ctx.session.user.id))
      .run();

    return res;
  }),
});
