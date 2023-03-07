import { z } from "zod";
import { User } from "~/db/schema";
import { and, asc, desc, eq, or } from "drizzle-orm/expressions";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input, ctx }) => {
      let user;
      try {
        user = await ctx.db
          .select()
          .from(User)
          .where(eq(User.id, input.text))
          .get();
      } catch (e) {
        //console.error(e);
      }

      return {
        greeting: user,
      };
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
