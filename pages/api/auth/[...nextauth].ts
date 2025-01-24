import NextAuth from "next-auth";
import CredentialsProvider  from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb";
import bcrypt from 'bcryptjs';
import User from "@/models/User";


export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {label: "Email", type: "text"},
        password: {label: "Password", type: "password"}
      },
      async authorize(credentials) {
        if(!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectDB();
        
          const user = await User.findOne({ email: credentials.email });


          if (!user) {
            return null;
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(
            credentials.password, 
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          // Return user object for session
          return {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            venueId: user.venueId,
            name: user.name,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.venueId = user.venueId;
        token.name = user.name
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.venueId = token.venueId;
      session.user.name = token.name;
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
})