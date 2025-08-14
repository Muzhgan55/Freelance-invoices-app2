// clients.js
import { loadClients, saveClients } from './data.js';
import { generateId, confirmAction } from './utils.js';

const clientForm = document.getElementById('client-form');
const clientTableBody = document.getElementById('client-table-body');
const cancelEditBtn = document.getElementById('cancel-edit');

let clients = loadClients();
let editClientId = null;

// Render clients table
function renderClients() {
  clientTableBody.innerHTML = clients.length
    ? clients.map(c => `
        <tr>
          <td>${c.name}</td>
          <td>${c.email}</td>
          <td>${c.company}</td>
          <td>${c.notes || ''}</td>
          <td>
            <button class="btn btn-sm btn-warning edit-btn" data-id="${c.id}">Edit</button>
            <button class="btn btn-sm btn-danger delete-btn" data-id="${c.id}">Delete</button>
          </td>
        </tr>
      `).join('')
    : `<tr><td colspan="5" class="text-center">No clients yet</td></tr>`;

  // Attach event listeners for edit/delete
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => startEditClient(btn.dataset.id));
  });
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteClient(btn.dataset.id));
  });
}

// Add or update client
clientForm.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('client-name').value.trim();
  const email = document.getElementById('client-email').value.trim();
  const company = document.getElementById('client-company').value.trim();
  const notes = document.getElementById('client-notes').value.trim();

  if (editClientId) {
    // Update
    clients = clients.map(c => c.id === editClientId ? { ...c, name, email, company, notes } : c);
    editClientId = null;
    cancelEditBtn.style.display = 'none';
  } else {
    // Add new
    clients.push({ id: generateId(), name, email, company, notes });
  }

  saveClients(clients);
  clientForm.reset();
  renderClients();
});

// Start editing a client
function startEditClient(id) {
  const client = clients.find(c => c.id === id);
  if (!client) return;
  editClientId = id;
  document.getElementById('client-name').value = client.name;
  document.getElementById('client-email').value = client.email;
  document.getElementById('client-company').value = client.company;
  document.getElementById('client-notes').value = client.notes;
  cancelEditBtn.style.display = 'inline-block';
}

// Cancel edit
cancelEditBtn.addEventListener('click', () => {
  editClientId = null;
  clientForm.reset();
  cancelEditBtn.style.display = 'none';
});

// Delete client
function deleteClient(id) {
  if (!confirmAction('Are you sure you want to delete this client?')) return;
  clients = clients.filter(c => c.id !== id);
  saveClients(clients);
  renderClients();
}

// Initial render
renderClients();