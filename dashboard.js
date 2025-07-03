async function runTest(testType) {
  const res = await fetch(`/api/run-${testType}`, { method: 'POST' });
  const text = await res.text();
  document.getElementById('result').innerText = text;
}
