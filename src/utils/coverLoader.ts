// Simple cache to avoid refetching identical covers in a single session
const coverCache: Record<string, string> = {};

export const getBookCover = async (title: string, author: string, id: string): Promise<string> => {
  const query = encodeURIComponent(`${title} ${author} book cover`);
  
  if (coverCache[id]) {
    return coverCache[id];
  }

  // Option 1: OpenLibrary API (often missing Vietnamese covers, but fast and free)
  try {
    const res = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}&limit=1`);
    const data = await res.json();
    if (data.docs && data.docs.length > 0 && data.docs[0].cover_i) {
      const url = `https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-L.jpg`;
      coverCache[id] = url;
      return url;
    }
  } catch (e) {
    console.error("OpenLibrary fetch failed", e);
  }

  // Option 2: Fallback to Google Books API
  try {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(title)}+inauthor:${encodeURIComponent(author)}`);
    const data = await res.json();
    if (data.items && data.items.length > 0) {
      const item = data.items.find((i: any) => i.volumeInfo.imageLinks?.thumbnail);
      if (item) {
        let url = item.volumeInfo.imageLinks.thumbnail.replace('http:', 'https:');
        // Hack to get higher res from Google Books
        url = url.replace('&edge=curl', '');
        coverCache[id] = url;
        return url;
      }
    }
  } catch (e) {
    console.error("Google Books fetch failed", e);
  }

  // Option 3: Procedural Abstract Fallback
  // Instead of grey boxes, generate a deterministic abstract gradient based on the book ID
  const hash = id.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
  const h1 = Math.abs(hash % 360);
  const h2 = (h1 + 40) % 360;
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="hsl(${h1}, 70%, 60%)"/><stop offset="100%" stop-color="hsl(${h2}, 80%, 40%)"/></linearGradient></defs><rect width="100%" height="100%" fill="url(%23g)"/><text x="50%" y="50%" font-family="serif" font-size="24" fill="white" font-weight="bold" text-anchor="middle" dominant-baseline="middle" opacity="0.8">📚</text></svg>`;
};
