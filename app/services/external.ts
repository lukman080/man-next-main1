// app/services/external.ts

export interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  image?: string;
}

export async function fetchExternal(
  source: "products" | "news",
  q?: string
): Promise<SearchResult[]> {
  
  // --- กรณี Products (FakeStoreAPI) ---
  if (source === "products") {
    const res = await fetch("https://fakestoreapi.com/products", { 
      cache: "no-store" 
    });
    
    if (!res.ok) return [];
    
    const items = await res.json();
    
    const filtered = q
      ? items.filter((p: any) =>
          (p.title + " " + p.category).toLowerCase().includes(q.toLowerCase())
        )
      : items;

    return filtered.slice(0, 6).map((p: any) => ({
      id: String(p.id),
      title: p.title,
      // แก้ไข: ใส่ Backtick (`) ครอบ
      subtitle: `$${p.price} • ${p.category}`, 
      url: p.image, 
      image: p.image
    }));
  }

  // --- กรณี News (Algolia / Hacker News) ---
  const url = new URL("https://hn.algolia.com/api/v1/search");
  url.searchParams.set("tags", "story");
  url.searchParams.set("hitsPerPage", "6");
  if (q) url.searchParams.set("query", q);

  try {
    const res = await fetch(url.toString(), { 
      cache: "no-store"
    });

    if (!res.ok) return [];

    const data = await res.json();

    return (data.hits || []).map((h: any) => ({
      id: String(h.objectID),
      title: h.title,
      // แก้ไข: ใส่ Backtick (`) ครอบ
      subtitle: `${h.points ?? 0} points • by ${h.author}`,
      // แก้ไข: ใส่ Backtick (`) ครอบตรง URL
      url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
      image: undefined 
    }));
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}