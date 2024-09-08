import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connection from "@/lib/Database";
import UserModel from "@/model/User";
import { NextResponse } from "next/server";

// ------------------------------------------

connection(); // database connection

// ------------------------------------------
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "email",
          type: "email",
        },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials: any, req): Promise<any> {
        console.log(credentials);
        try {
          const user: any = await UserModel.findOne({
            $or: [
              { email: credentials?.email },
              { username: credentials?.email },
            ],
          });

          const checkPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (user.isVerified) {
            if (!user.email && !checkPassword) {
              return NextResponse.json(
                { message: "Credentials are wrongs", success: false },
                { status: 401 }
              );
            } else {
              return user;
              //   return NextResponse.json(
              //     { message: "User found successfully", success: true },
              //     { status: 200 }
              //   );
            }
          } else {
            return NextResponse.json(
              { message: "Verify Your Email First For Login", success: false },
              { status: 403 }
            );
          }
        } catch (error: any) {
          console.log(error);
          throw new Error(error);
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 days
  },
  jwt: {
    secret: process.env.TOKEN_SECRET,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
      }

      return session;
    },
  },

  pages: {
    signIn: "/signIn",
  },
};
