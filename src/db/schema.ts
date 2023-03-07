import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const Session = sqliteTable(
  "Session",
  {
    id: text("id").primaryKey(),
    sessionToken: text("sessionToken").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => User.id),
    expires: integer("expires", { mode: "timestamp" }).notNull(),
  },
  (session) => ({
    sessionTokenIdx: uniqueIndex("sessionTokenIdx").on(session.sessionToken),
  })
);

export const VerificationToken = sqliteTable(
  "VerificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp" }).notNull(),
  },
  (token) => ({
    tokenIdx: uniqueIndex("tokenIdx").on(token.identifier, token.token),
  })
);

export const User = sqliteTable(
  "User",
  {
    id: text("id").primaryKey().notNull(),
    name: text("name"),
    email: text("email").notNull(),
    emailVerified: integer("expires", { mode: "timestamp" }),
    image: text("image"),
    role: text("role"),
    isOnboarded: integer("isOnboarded").default(0),
    onboardingStep: integer("onboardingStep").default(1),
    nickname: text("nickname"),
    hasAgreedToToS: integer("hasAgreedToToS").default(0),
  },
  (user) => ({
    emailIdx: uniqueIndex("emailIdx").on(user.email),
  })
);

export const Account = sqliteTable(
  "Account",
  {
    id: text("id").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => User.id),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    providerIdx: uniqueIndex("providerIdx").on(
      account.provider,
      account.providerAccountId
    ),
  })
);

const sqlite = new Database("./src/db/sqllite.db");
export const db = drizzle(sqlite);
