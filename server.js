import express from 'express';
import fs from 'fs';
import { exec } from 'child_process';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('frontend'));

// Run Teleport Hack Test
app.post('/api/run-teleport', (req, res) => {
  exec('python3 scripts/teleport_test.py', (err, stdout) => {
    if (err) return res.status(500).send('Error');
    logResult('teleport', stdout);
    res.send(`Teleport Test: ${stdout}`);
  });
});

// Run API Fuzzer
app.post('/api/run-fuzz', (req, res) => {
  exec('python3 scripts/fuzz_api.py', (err, stdout) => {
    if (err) return res.status(500).send('Error');
    logResult('fuzz', stdout);
    res.send(`API Fuzzer: ${stdout}`);
  });
});

// Get accounts
app.get('/api/accounts', (req, res) => {
  const data = JSON.parse(fs.readFileSync('backend/accounts.json'));
  res.json(data);
});

// Ban a player
app.post('/api/ban', (req, res) => {
  let data = JSON.parse(fs.readFileSync('backend/accounts.json'));
  const user = data.find(u => u.username === req.body.username);
  if (user) {
    user.status = 'banned';
    user.ban_reason = req.body.reason || 'No reason';
    fs.writeFileSync('backend/accounts.json', JSON.stringify(data, null, 2));
    res.send(`Banned ${user.username}`);
  } else {
    res.status(404).send('User not found');
  }
});

// Unban a player
app.post('/api/unban', (req, res) => {
  let data = JSON.parse(fs.readFileSync('backend/accounts.json'));
  const user = data.find(u => u.username === req.body.username);
  if (user) {
    user.status = 'active';
    user.ban_reason = '';
    fs.writeFileSync('backend/accounts.json', JSON.stringify(data, null, 2));
    res.send(`Unbanned ${user.username}`);
  } else {
    res.status(404).send('User not found');
  }
});

function logResult(test, result) {
  let logs = [];
  if (fs.existsSync('backend/logs.json')) {
    logs = JSON.parse(fs.readFileSync('backend/logs.json'));
  }
  logs.push({ test, result, date: new Date().toISOString() });
  fs.writeFileSync('backend/logs.json', JSON.stringify(logs, null, 2));
}

app.listen(PORT, () => {
  console.log(`Security Test Lab running on http://localhost:${PORT}`);
});
