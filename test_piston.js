const fetch = require('node-fetch'); // or native fetch in modern Node
async function test() {
  const res = await fetch("https://emkc.org/api/v2/piston/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: "python",
      version: "*",
      files: [{ name: "main.py", content: "print('Hello API')" }]
    })
  });
  const data = await res.json();
  console.log(data);
}
test();
