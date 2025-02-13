import NextAuth from "next-auth";
import User from "@/app/model/User";
import connectDB from "@/lib/dbconfig";
import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import bcrypt from 'bcrypt'

const handler = NextAuth({
    session: {
        strategy: "jwt",
    },
    providers: [
        // GoogleProvider({}),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_SECRET
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {},
                password: {}
            },
            async authorize(credentials) {
                try {
                    await connectDB();
                    if (!credentials) {
                        throw new Error("Provide Credentials.");
                    } else if (!credentials.email || !credentials.password) {
                        throw new Error("Provide Credentials.");
                    }
                    const user = await User.findOne({ email: credentials.email });
                    if (!user) {
                        throw new Error("User not found.");
                    }
                    const isValidPassword = await bcrypt.compare(credentials.password, user.password);
                    if (!isValidPassword) {
                        throw new Error("Invailid Credentials.");
                    }
                    return user;
                } catch (error) {
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async signIn({ account, profile }) {
            if (account?.provider === "github") {
                await connectDB();
                const existingUser = await User.findOne({ email: profile?.email });
                if (!existingUser) {
                    await User.create({
                        username: profile?.name,
                        email: profile?.email,
                        isAdmin: false
                    })
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id || user._id,
                    token.email = user.email,
                    token.name = user.username || user.name,
                    token.isAdmin = user.isAdmin
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    email: token.email,
                    name: token.name,
                    picture: token.picture,
                    isAdmin: token.isAdmin
                }
            }
            return session;
        }
    },
    pages: {
        signIn: '/sign-in',
    },
    secret: process.env.NEXTAUTH_SECRET
});

export { handler as GET, handler as POST }