import NextAuth from "next-auth";
import { authOptions } from "@/app/lib/auth"; // ต้อง import มาจากไฟล์ที่คุณสร้าง

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };