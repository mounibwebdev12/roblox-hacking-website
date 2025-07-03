async function loadAccounts() {
  const res = await fetch('/api/accounts');
  const accounts = await res.json();
  let html = '<tr><th>Username</th><th>Avatar</th><th>Status</th><th>Action</th></tr>';
  accounts.forEach(acc => {
    html += `<tr>
      <td>${acc.username}</td>
      <td><img src="${acc.avatar}" width="50"/></td>
      <td>${acc.status}</td>
      <td>
        ${acc.status === 'banned'
          ? `<button onclick="unban('${acc.username}')">Unban</button>`
          : `<button onclick="ban('${acc.username}')">Ban</button>`
        }
      </td>
    </tr>`;
  });
  document.getElementById('accountsTable').innerHTML = html;
}

async function ban(username) {
  await fetch('/api/ban', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ username, reason: 'Manual ban' })
  });
  loadAccounts();
}

async function unban(username) {
  await fetch('/api/unban', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ username })
  });
  loadAccounts();
}

loadAccounts();
