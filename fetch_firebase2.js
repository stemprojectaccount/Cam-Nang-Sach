import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

async function check() {
  try {
    const res = await fetch('http://localhost:3000/src/firebase.ts');
    const text = await res.text();
    console.log(text.includes('AIzaSyD4ulBzUpcbzDftHr9zQLr81GbdEH4xa3Y'));
  } catch (err) {
    console.error(err);
  }
}
check();
