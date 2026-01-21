// app/admin/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // 1. ยังไม่ Login -> ไปหน้า Login
  if (!session) redirect("/login?callbackUrl=/admin");

  const role = (session.user as any).role;

  // 2. Login แล้ว แต่ไม่ใช่ Admin -> แสดงหน้า Error สวยๆ
  if (role !== "admin") {
    return (
      <div className="container" style={styles.errorContainer}>
        <div style={styles.errorCard}>
          {/* SVG Icon รูปแม่กุญแจสีแดง */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={styles.icon}
          >
            <path
              fillRule="evenodd"
              d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z"
              clipRule="evenodd"
            />
          </svg>

          <h1 style={styles.title}>403 - Access Denied</h1>
          <p style={styles.description}>
            ขออภัย คุณไม่มีสิทธิ์เข้าถึงหน้าผู้ดูแลระบบ
          </p>

          <div style={styles.roleBox}>
            สถานะของคุณคือ: <span style={styles.roleBadge}>{role}</span>
          </div>

          <Link href="/dashboard" className="btn" style={styles.backButton}>
            ⬅️ กลับสู่หน้าหลัก
          </Link>
        </div>
      </div>
    );
  }

  // 3. ถ้าเป็น Admin ให้แสดงเนื้อหาปกติ
  return (
    <section className="container" style={{paddingTop: '2rem'}}>
      <h1>Admin Panel</h1>
      <article className="card">
        <h2>ยินดีต้อนรับผู้ดูแลระบบ</h2>
        <p>คุณสามารถจัดการข้อมูลต่างๆ ได้จากหน้านี้</p>
        {/* เพิ่มเนื้อหา Admin ตรงนี้ */}
      </article>
    </section>
  );
}

// ==========================================
// Styles (CSS-in-JS แบบง่ายๆ สำหรับหน้านี้)
// ==========================================
const styles = {
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '70vh', // ให้สูงเกือบเต็มจอ
    padding: '20px',
  },
  errorCard: {
    textAlign: 'center' as const,
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)', // เงาฟุ้งๆ
    maxWidth: '500px',
    width: '100%',
    border: '1px solid #eee',
  },
  icon: {
    width: '80px',
    height: '80px',
    color: '#dc3545', // สีแดงเข้ม
    marginBottom: '20px',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  description: {
    fontSize: '1.1rem',
    color: '#666',
    marginBottom: '25px',
  },
  roleBox: {
    marginBottom: '30px',
    fontSize: '0.95rem',
    color: '#888',
    backgroundColor: '#f8f9fa',
    padding: '10px',
    borderRadius: '6px',
    display: 'inline-block',
  },
  roleBadge: {
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'uppercase' as const,
  },
  backButton: {
    // ปรับปุ่มเพิ่มเติมจาก class .btn เดิมถ้าต้องการ
    padding: '12px 24px',
    fontSize: '1rem',
  }
};