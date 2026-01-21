import "./globals.css";
import Providers from "@/app/providers"; // นำเข้า Providers (สำหรับ NextAuth)
import Navbar from "@/app/components/Navbar"; // นำเข้า Navbar ที่เราเพิ่งสร้าง

// Metadata (ย้ายมาไว้ที่นี่ได้เพราะเป็น Server Component)
export const metadata = {
  title: "LUKMAN WEB",
  description: "Advanced Web Development",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>
        {/* คลุมด้วย Providers เพื่อให้ Authentication ใช้งานได้ทั้งเว็บ */}
        <Providers>
          
          {/* ใส่ Navbar ที่เราแยกโค้ดออกไป */}
          <Navbar />

          {/* ส่วนเนื้อหาหลัก */}
          <main className="site-content">
            {children}
          </main>

          {/* ส่วน Footer (เขียนสดในนี้ได้เลยเพราะไม่มี Logic ซับซ้อน) */}
          <footer className="site-footer">
            <p>
              © {new Date().getFullYear()} mang— Advanced Web Development
            </p>
          </footer>

        </Providers>
      </body>
    </html>
  );
}