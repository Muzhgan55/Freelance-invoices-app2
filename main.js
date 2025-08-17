import { loadClients, loadInvoices } from './data.js';

//import { renderClientOptions } from './render.js';

// Import JSON file with quotes
import {quotes} from './qoutes.js';
console.log('Quotes loaded:', quotes);

let clients = loadClients();
let invoices = loadInvoices();

// Initialize Dashboard
function initialize() {
  renderDashboardStats();
  loadRandomQuote();
  
}

// Render stats
function renderDashboardStats() {
  document.getElementById('totalClients').textContent = clients.length;
  document.getElementById('totalInvoices').textContent = invoices.length;

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  document.getElementById('totalRevenue').textContent = `Afs ${totalRevenue}`;
}

// Load a random quote from imported JSON
function loadRandomQuote() {
  if (!quotes || quotes.length === 0) {
    document.getElementById('quoteText').textContent = 'No quotes available.';
    document.getElementById('quoteAuthor').textContent = '';
    return;
  }

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById('quoteText').textContent = `"${randomQuote.text}"`;
  document.getElementById('quoteAuthor').textContent = `— ${randomQuote.author}`;
}

// Render invoice chart
function renderInvoiceChart() {
  const ctx = document.getElementById('invoiceChart').getContext('2d');
  const paidCount = invoices.filter(inv => inv.paid).length;
  const unpaidCount = invoices.length - paidCount;

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Paid Invoices', 'Unpaid Invoices'],
      datasets: [{
        data: [paidCount, unpaidCount],
        backgroundColor: ['#f7c948', '#f76c6c']
      }]
    }
  });
}

// Run when DOM is loaded
window.addEventListener('DOMContentLoaded', initialize);