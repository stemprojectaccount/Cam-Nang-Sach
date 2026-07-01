import { collection, getDocs, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { Book } from '../types';

export const getReadableBooks = async (): Promise<Book[]> => {
  const booksCol = collection(db, 'readable_books');
  const bookSnapshot = await getDocs(booksCol);
  return bookSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book));
};

export const getSuggestedBooks = async (): Promise<Book[]> => {
  const booksCol = collection(db, 'suggested_books');
  const bookSnapshot = await getDocs(booksCol);
  return bookSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book));
};

export const addBook = async (collectionName: string, book: Omit<Book, 'id'>) => {
  const booksCol = collection(db, collectionName);
  const docRef = await addDoc(booksCol, book);
  return docRef.id;
};

export const uploadPdf = async (file: File, onProgress: (p: number) => void): Promise<string> => {
  const storageRef = ref(storage, 'books/' + file.name + '_' + Date.now());
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      },
      (error) => {
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
};
