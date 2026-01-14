// app/blog/page.tsx
import Link from "next/link";
import DeleteButton from "./DeleteButton"; 

// กำหนด Type ของ Props ให้ชัดเจน
type Props = {
  searchParams: Promise<{ source?: string; q?: string }>;
};

export default async function BlogPage({ searchParams }: Props) {
  // 1. (Next.js 15) ต้อง await searchParams ก่อนใช้งาน
  const { source: rawSource, q: rawQ } = await searchParams;

  const source = rawSource === "news" ? "news" : "products";
  const q = rawQ || "";

  // ---------------------------------------------------------
  // 2. จุดที่แก้ไขหลัก: ใส่ Backtick (`) ครอบ URL
  // ---------------------------------------------------------
  const apiUrl = `http://localhost:3000/api/aggregate?source=${source}&q=${encodeURIComponent(q)}`;
  
  const res = await fetch(apiUrl, { 
    cache: "no-store" 
  });

  // เช็คว่า API พังหรือไม่ ถ้าพังให้แสดง Error สวยๆ แทนจอขาว
  if (!res.ok) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
         <h2 style={{ color: 'red' }}>Error Loading Data</h2>
         <p>Status: {res.status}</p>
         <p>กรุณาตรวจสอบว่ารัน Server อยู่และไฟล์ <code>api/aggregate/route.ts</code> ถูกต้อง</p>
      </div>
    );
  }
  
  const data = await res.json();

  return (
    <section className="container">
      {/* --- ส่วนหัว Header และปุ่มเลือก Source --- */}
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>Blog Aggregator</h1>
        <div className="row" style={{ gap: "10px" }}>
          <Link 
            className={`btn ${source === 'products' ? 'active' : ''}`} 
            href="/blog?source=products"
          >
            Products
          </Link>
          <Link 
            className={`btn ${source === 'news' ? 'active' : ''}`} 
            href="/blog?source=news"
          >
            News
          </Link>
          <Link 
            className="btn" 
            style={{ backgroundColor: '#28a745', color: 'white' }} 
            href="/blog/new"
          >
            + New Post
          </Link>
        </div>
      </div>

      {/* --- Search Form --- */}
      <form className="row" action="/blog" method="get" style={{ margin: "20px 0", gap: "10px", alignItems: "center" }}>
        <input type="hidden" name="source" value={source} />
        <input 
            name="q" 
            defaultValue={q} 
            placeholder={`Search in ${source}...`} 
            style={{ padding: "8px", flex: 1, maxWidth: "300px" }}
        />
        <button className="btn" type="submit">Search</button>
      </form>

      {/* --- ส่วนแสดง My Posts (Internal) --- */}
      <h2>My Posts (Internal)</h2>
      <div className="grid">
        {/* ใส่ || [] กัน Error กรณีไม่มีข้อมูล */}
        {(data.internal || []).length === 0 ? <p>No internal posts found.</p> : null}
        
        {(data.internal || []).map((p: any) => (
          <article key={p.slug} className="card">
            <h3>{p.title}</h3>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
              <Link className="btn" href={`/blog/${p.slug}`}>
                Read →
              </Link>
              <Link className="btn" style={{ backgroundColor: '#f0ad4e', color: 'white' }} href={`/blog/edit/${p.slug}`}>
                Edit
              </Link>
              <DeleteButton slug={p.slug} />
            </div>
          </article>
        ))}
      </div>

      <hr style={{ margin: "40px 0", borderTop: "1px solid #ccc" }} />

      {/* --- ส่วนแสดง External Data --- */}
      <h2 style={{ marginTop: 18 }}>
        {source === "news" ? "External News (Hacker News)" : "External Products (FakeStore)"}
      </h2>
      
      {data.error ? <p style={{ color: 'red' }}><small>{data.error}</small></p> : null}
      
      <div className="grid">
        {(data.external || []).length === 0 ? <p>No external data found.</p> : null}

        {(data.external || []).map((x: any) => (
          <article key={x.id} className="card">
            {x.image ? (
              <img
                src={x.image}
                alt={x.title}
                style={{ width: "100%", height: 160, objectFit: "contain", marginBottom: "10px" }}
              />
            ) : null}
            <h3 style={{ fontSize: "1.1rem" }}>{x.title}</h3>
            {x.subtitle ? <p style={{ color: '#666', fontSize: '0.9rem' }}>{x.subtitle}</p> : null}
            
            {x.url ? (
              <a 
                className="btn" 
                href={x.url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ marginTop: "auto", display: "inline-block" }}
              >
                Open Link ↗
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}