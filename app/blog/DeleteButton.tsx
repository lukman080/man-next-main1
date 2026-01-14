"use client"; // ต้องมีบรรทัดนี้เพื่อใช้ useRouter และ onClick

import { useRouter } from "next/navigation";

export default function DeleteButton({ slug }: { slug: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm("คุณแน่ใจหรือไม่ที่จะลบบทความนี้?")) {
      const res = await fetch(`/api/posts?slug=${slug}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh(); // รีเฟรชหน้าเว็บเพื่อให้ข้อมูลที่ถูกลบหายไป
      }
    }
  };

  return (
    <button onClick={handleDelete} className="btn" style={{ backgroundColor: 'red', color: 'white' }}>
      Delete
    </button>
  );
}