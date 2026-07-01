import { doc, getDoc, setDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';

export interface LeaderboardEntry {
  id: string;
  name: string;
  minutesRead: number;
  booksRead: number;
  lastUpdated: number;
}

export const updateLeaderboard = async (entry: LeaderboardEntry) => {
  try {
    const docRef = doc(db, 'leaderboard', entry.id);
    const existing = await getDoc(docRef);
    if (existing.exists()) {
      const data = existing.data() as LeaderboardEntry;
      // Only update if stats are higher to prevent sync issues
      if (entry.minutesRead >= data.minutesRead) {
        await setDoc(docRef, entry);
      }
    } else {
      await setDoc(docRef, entry);
    }
  } catch (error) {
    console.error("Lỗi cập nhật Bảng Vàng:", error);
  }
};

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  try {
    const q = query(
      collection(db, 'leaderboard'), 
      orderBy('minutesRead', 'desc'), 
      limit(50)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.data() as LeaderboardEntry);
  } catch (error) {
    console.error("Lỗi lấy Bảng Vàng:", error);
    return [];
  }
};
