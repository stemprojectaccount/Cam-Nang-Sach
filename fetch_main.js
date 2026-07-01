async function check() {
  try {
    const res = await fetch('http://localhost:3000/src/main.tsx');
    const text = await res.text();
    console.log(res.status, text.slice(0, 100));
  } catch (err) {
    console.error(err);
  }
}
check();
