// data.js

// Load clients from localStorage
export function loadClients() {
  return JSON.parse(localStorage.getItem('clients')) || [];
}

// Save clients to localStorage
export function saveClients(clients) {
  localStorage.setItem('clients', JSON.stringify(clients));
}

// Load invoices from localStorage
export function loadInvoices() {
  return JSON.parse(localStorage.getItem('invoices')) || [];
}

// Save invoices to localStorage
export function saveInvoices(invoices) {
  localStorage.setItem('invoices', JSON.stringify(invoices));
}