import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      /** The user's postal address. */
      _id: string;
    } & DefaultSession["user"];
  }
}

// source : https://next-auth.js.org/getting-started/typescript
