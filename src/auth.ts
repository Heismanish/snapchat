import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import { connectToMongoDB } from "./lib/db";
import User from "./models/userModel";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Github({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async session({ session }) {
      try {
        await connectToMongoDB();
        if (session) {
          const user = await User.findOne({
            email: session.user.email,
          });
          if (user) {
            session.user._id = user._id;
            return session;
          } else {
            throw new Error("Invalid session");
          }
        } else {
          throw new Error("Invalid session");
        }
      } catch (error) {
        console.log("Invalid Session:", error);
        throw new Error("Invalid session");
      }
    },
    async signIn({ account, profile }) {
      if (account?.provider === "github") {
        await connectToMongoDB();

        try {
          const user = await User?.findOne({ email: profile?.email });

          // signup if not already a user
          if (!user) {
            const newUser = await User.create({
              username: profile?.login,
              email: profile?.email,
              fullname: profile?.name?.replace(" ", "").toLowerCase(),
              avatar: profile?.avatar_url,
            });

            await newUser.save();
          }
          return true; // to indicate sign in was a success
        } catch (error) {
          console.log(error);
          return false; // to indicate sign in has failed
        }
      }
      return false;
    },
  },
});
