async function check() {
  try {
    const res = await fetch('http://localhost:3000/src/firebase.ts');
    const text = await res.text();
    console.log(res.status, text.slice(0, 500));
  } catch (err) {
    console.error(err);
  }
}
check();
