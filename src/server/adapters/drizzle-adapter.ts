import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { Adapter, AdapterAccount } from "next-auth/adapters";
import { User, Account, Session, VerificationToken } from "~/db/schema";
import { eq } from "drizzle-orm/expressions";
import { randomUUID } from "crypto";

export function DrizzleSqliteAdapter(d: BetterSQLite3Database): Adapter {
  return {
    createUser: (data) => {
      // needed due to drizzle-orm bug, this has been fixed in the beta version
      data.emailVerified = new Date();
      
      return d
        .insert(User)
        .values({ id: randomUUID(), ...data })
        .returning()
        .get();
    },
    getUser: (id) => d.select().from(User).where(eq(User.id, id)).get(),
    getUserByEmail: (email) => {
      let user;
      try {
        user = d.select().from(User).where(eq(User.email, email)).get();
      } catch (e) {
        return null;
      }
      return user;
    },
    async getUserByAccount(provider_providerAccountId) {
      let account;
      try {
        account = d
          .select()
          .from(Account)
          .leftJoin(User, eq(Account.userId, User.id))
          .where(
            eq(
              Account.providerAccountId,
              provider_providerAccountId.providerAccountId
            )
          )
          .get();
      } catch (e) {
        return null;
      }
      return account?.User ?? null;
    },
    updateUser: ({ id, ...data }) =>
      d.update(User).set(data).where(eq(User.id, id!)).returning().get(),
    deleteUser: (id) => d.delete(User).where(eq(User.id, id)).returning().get(),
    linkAccount: (data) => {
      return d
        .insert(Account)
        .values({ id: randomUUID(), ...data })
        .returning()
        .get() as unknown as AdapterAccount;
    },
    //   d.account.create({ data }) as unknown as AdapterAccount,
    unlinkAccount: (provider_providerAccountId) =>
      d
        .delete(Account)
        .where(
          eq(
            Account.providerAccountId,
            provider_providerAccountId.providerAccountId
          )
        )
        .returning()
        .get() as unknown as AdapterAccount,
    async getSessionAndUser(sessionToken) {
      try {
        const userAndSession = await d
          .select()
          .from(Session)
          .leftJoin(User, eq(Session.userId, User.id))
          .where(eq(Session.sessionToken, sessionToken))
          .get();

        if (!userAndSession) return null;
        const { User: user, Session: session } = userAndSession;
        if (!user) return null;
        return { user, session };
      } catch (e) {
        return null;
      }
    },
    createSession: (data: any) => {
      return d
        .insert(Session)
        .values({ id: randomUUID(), ...data })
        .returning()
        .get();
    },

    updateSession: (data) =>
      d
        .update(Session)
        .set(data)
        .where(eq(Session.sessionToken, data.sessionToken))
        .returning()
        .get(),
    deleteSession: (sessionToken) =>
      d
        .delete(Session)
        .where(eq(Session.sessionToken, sessionToken))
        .returning()
        .get(),
    async createVerificationToken(data) {
      const verificationToken = await d
        .insert(VerificationToken)
        .values(data)
        .returning()
        .get();
      // @ts-expect-errors // MongoDB needs an ID, but we don't
      if (verificationToken.id) delete verificationToken.id;
      return verificationToken;
    },
    async useVerificationToken(identifier_token) {
      try {
        const verificationToken = await d
          .delete(VerificationToken)
          .where(eq(VerificationToken.identifier, identifier_token.identifier))
          .returning()
          .get();
        // @ts-expect-errors // MongoDB needs an ID, but we don't
        if (verificationToken.id) delete verificationToken.id;
        if (!verificationToken) return null;
        return verificationToken;
      } catch (error) {
        // If token already used/deleted, just return null
        if (error) return null;
        throw error;
      }
    },
  };
}
