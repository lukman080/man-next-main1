// app/api/admin/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const role = (session.user as any).role;
    if (role !== "admin") return Response.json({ error: "Forbidden" }, { status: 403 });
    return Response.json({ ok: true, message: "Admin-only API success!" });
}