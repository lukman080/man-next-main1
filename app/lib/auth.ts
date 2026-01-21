// app/lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    // -----------------------------------------------------------
    // 1. ใส่ Secret ตรงๆ ตรงนี้เลย (แก้ปัญหาอ่าน .env ไม่เจอ)
    // -----------------------------------------------------------
    secret: "test_secret_key_12345", 
    debug: true, // เปิด Debug mode เพื่อดู Error ใน Terminal

    session: { strategy: "jwt" },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials) return null;
                
                // Mock Data
                const accounts = [
                    { id: "u_admin_001", name: "Admin", email: "admin@tsu.ac.th", role: "admin", username: "admin", password: "admin123" },
                    { id: "u_demo_001", name: "Demo Student", email: "demo@tsu.ac.th", role: "user", username: "demo", password: "1234" },
                ];

                const found = accounts.find(
                    (a) => a.username === credentials.username && a.password === credentials.password
                );

                if (!found) return null;

                return {
                    id: found.id,
                    name: found.name,
                    email: found.email,
                    role: found.role
                } as any;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = (user as any).id;
                token.role = (user as any).role;
            }
            return token;
        },
        async session({ session, token }) {
            (session.user as any).id = token.id;
            (session.user as any).role = token.role;
            return session;
        },
    },
    pages: { signIn: "/login" },
};