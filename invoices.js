import { loadInvoices, saveInvoices, loadClients } from './data.js';
import { generateId, formatCurrency, confirmAction } from './utils.js';

const invoiceForm = document.getElementById('invoice-form');
const invoiceTableBody = document.getElementById('invoice-table-body');
const cancelEditBtn = document.getElementById('cancel-invoice-edit'); // ✅ matches HTML
const invoiceClientSelect = document.getElementById('invoice-client');

let invoices = loadInvoices();
let clients = loadClients();
let editInvoiceId = null;

// Populate client dropdown
function populateClientDropdown() {
  invoiceClientSelect.innerHTML = '<option value="">Select Client</option>' +
    clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

// Render invoices table
function renderInvoices() {
  invoiceTableBody.innerHTML = invoices.length
    ? invoices.map(i => {
        const client = clients.find(c => c.id === i.clientId);
        return `
          <tr>
            <td>${client ? client.name : 'Unknown'}</td>
            <td>${formatCurrency(i.amount)}</td>
            <td>${i.date}</td>
            <td>${i.notes || ''}</td>   <!-- ✅ use notes -->
            <td>
              <button class="btn btn-sm btn-warning edit-btn" data-id="${i.id}">Edit</button>
              <button class="btn btn-sm btn-danger delete-btn" data-id="${i.id}">Delete</button>
            </td>
          </tr>
        `;
      }).join('')
    : `<tr><td colspan="5" class="text-center">No invoices yet</td></tr>`;

  // Attach events
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => startEditInvoice(btn.dataset.id));
  });
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteInvoice(btn.dataset.id));
  });
}

// Add or update invoice
invoiceForm.addEventListener('submit', e => {
  e.preventDefault();
  const clientId = invoiceClientSelect.value;
  const amount = parseFloat(document.getElementById('invoice-amount').value);
  const notes = document.getElementById('invoice-notes').value.trim(); // ✅ notes instead of description
  const date = document.getElementById('invoice-date').value;

  if (!clientId) return alert('Please select a client.');

  if (editInvoiceId) {
    invoices = invoices.map(i =>
      i.id === editInvoiceId
        ? { ...i, clientId, amount, notes, date }
        : i
    );
    editInvoiceId = null;
    cancelEditBtn.style.display = 'none';
  } else {
    invoices.push({
      id: generateId(),
      clientId,
      amount,
      notes,
      date,
      status: 'Pending'
    });
  }

  saveInvoices(invoices);
  invoiceForm.reset();
  renderInvoices();
});

// Start editing an invoice
function startEditInvoice(id) {
  const invoice = invoices.find(i => i.id === id);
  if (!invoice) return;
  editInvoiceId = id;
  invoiceClientSelect.value = invoice.clientId;
  document.getElementById('invoice-amount').value = invoice.amount;
  document.getElementById('invoice-notes').value = invoice.notes || ''; // ✅ fixed
  document.getElementById('invoice-date').value = invoice.date;
  cancelEditBtn.style.display = 'inline-block';
}

// Cancel edit
cancelEditBtn.addEventListener('click', () => {
  editInvoiceId = null;
  invoiceForm.reset();
  cancelEditBtn.style.display = 'none';
});

// Delete invoice
function deleteInvoice(id) {
  if (!confirmAction('Are you sure you want to delete this invoice?')) return;
  invoices = invoices.filter(i => i.id !== id);
  saveInvoices(invoices);
  renderInvoices();
}

// Initial render
populateClientDropdown();
renderInvoices();
