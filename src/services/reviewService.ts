import { collection, addDoc, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase';

export interface BookReview {
  id: string;
  bookId: string;
  author: string;
  text: string;
  createdAt: number;
}

export const addReview = async (review: Omit<BookReview, 'id'>): Promise<string | null> => {
  try {
    const docRef = await addDoc(collection(db, 'reviews'), review);
    return docRef.id;
  } catch (error) {
    console.error("Error adding review:", error);
    return null;
  }
};

export const getReviews = async (bookId: string): Promise<BookReview[]> => {
  try {
    const q = query(
      collection(db, 'reviews'),
      where('bookId', '==', bookId),
      // Need composite index for orderBy, skipping for now if it fails
      // orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BookReview));
    // Sort manually on client to avoid composite index requirement for now
    return reviews.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error("Error getting reviews:", error);
    return [];
  }
};
